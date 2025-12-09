using Mercado1.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servicios
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddControllers()
.AddJsonOptions(options =>
 {
     options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
 });


var app = builder.Build();

// Middleware para favicon
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/favicon.ico")
    {
        context.Response.ContentType = "image/x-icon";
        await context.Response.SendFileAsync(
            Path.Combine(app.Environment.WebRootPath, "favicon.ico")
        );
        return;
    }
    await next();
});

// Middlewares estándar
app.UseCors("PermitirTodo");
app.UseDefaultFiles(); // sirve index.html automáticamente
app.UseStaticFiles();  // habilita archivos en wwwroot
app.MapControllers();

app.Run();