SELECT * FROM dbo.__EFMigrationsHistory;

SELECT * FROM dbo.Usuarios

SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DetallePedidos'

SELECT * FROM Carrito;

SELECT * FROM dbo.Productos

SELECT * FROM dbo.EstadosPedido

INSERT INTO Promociones (
    Titulo_PR,
    Descripcion_PR,
    ImagenUrl_PR,
    FechaInicio_PR,
    FechaFin_PR,
    Activo_PR,
    Id_P
)
VALUES (
    'Descuento 20% en Estufas',
    'Promoción válida hasta fin de mes',
    'imagenes/promociones/promo-estufa.jpg',
    '2025-12-01',
    '2025-12-31',
    1,
    2 -- ID del producto relacionado
);

SELECT * FROM dbo.Promociones

