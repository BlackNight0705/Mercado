-- =========================================
-- BASE DE DATOS
-- =========================================
CREATE DATABASE TiendaOnline;
GO
USE TiendaOnline;
GO

-- =========================================
-- USUARIOS
-- =========================================
CREATE TABLE Usuarios (
    Id_U INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_U AS ('U-' + RIGHT('0000' + CAST(Id_U AS VARCHAR(4)), 4)) PERSISTED,
    Nombre_U NVARCHAR(100) NOT NULL,
    Correo_U NVARCHAR(150) UNIQUE NOT NULL,
    Contrasena_U NVARCHAR(255) NOT NULL,
    Rol_U NVARCHAR(20) DEFAULT 'cliente'
);

-- =========================================
-- CATEGORÍAS (se crea antes de Productos)
-- =========================================
CREATE TABLE Categorias (
    Id_C INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_C AS ('C-' + RIGHT('0000' + CAST(Id_C AS VARCHAR(4)), 4)) PERSISTED,
    Nombre_C NVARCHAR(100) NOT NULL,
    Descripcion_C NVARCHAR(255)
);

-- =========================================
-- PRODUCTOS (ya puede referenciar Categorias)
-- =========================================
CREATE TABLE Productos (
    Id_P INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_P AS ('P-' + RIGHT('0000' + CAST(Id_P AS VARCHAR(4)), 4)) PERSISTED,
    Nombre_P NVARCHAR(150) NOT NULL,
    Descripcion_P NVARCHAR(MAX),
    Precio_P DECIMAL(10,2) NOT NULL,
    Stock_P INT DEFAULT 0,
    ImagenUrl_P NVARCHAR(255),
    Id_C INT FOREIGN KEY REFERENCES Categorias(Id_C)
);

-- =========================================
-- PROMOCIONES
-- =========================================
CREATE TABLE Promociones (
    Id_PR INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_PR AS ('PR-' + RIGHT('0000' + CAST(Id_PR AS VARCHAR(4)), 4)) PERSISTED,
    Titulo_PR NVARCHAR(100) NOT NULL,
    Descripcion_PR NVARCHAR(255),
    ImagenUrl_PR NVARCHAR(255),
    FechaInicio_PR DATE NOT NULL,
    FechaFin_PR DATE NOT NULL,
    Activo_PR BIT DEFAULT 1,
    Id_P INT FOREIGN KEY REFERENCES Productos(Id_P)
);

-- =========================================
-- PEDIDOS
-- =========================================
CREATE TABLE Pedidos (
    Id_PE INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_PE AS ('PE-' + RIGHT('0000' + CAST(Id_PE AS VARCHAR(4)), 4)) PERSISTED,
    Id_U INT FOREIGN KEY REFERENCES Usuarios(Id_U),
    Fecha_PE DATE DEFAULT GETDATE(),
    Estado_PE NVARCHAR(20) DEFAULT 'pendiente',
    DireccionEnvio_PE NVARCHAR(255)
);

-- =========================================
-- DETALLE PEDIDO
-- =========================================
CREATE TABLE DetallePedido (
    Id_DP INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_DP AS ('DP-' + RIGHT('0000' + CAST(Id_DP AS VARCHAR(4)), 4)) PERSISTED,
    Id_PE INT FOREIGN KEY REFERENCES Pedidos(Id_PE),
    Id_P INT FOREIGN KEY REFERENCES Productos(Id_P),
    Cantidad_DP INT NOT NULL,
    PrecioUnitario_DP DECIMAL(10,2) NOT NULL
);

-- =========================================
-- RESEÑAS
-- =========================================
CREATE TABLE Reseñas (
    Id_R INT IDENTITY(1,1) PRIMARY KEY,
    Codigo_R AS ('R-' + RIGHT('0000' + CAST(Id_R AS VARCHAR(4)), 4)) PERSISTED,
    Id_U INT FOREIGN KEY REFERENCES Usuarios(Id_U),
    Id_P INT FOREIGN KEY REFERENCES Productos(Id_P),
    Comentario_R NVARCHAR(255),
    Calificacion_R INT CHECK (Calificacion_R BETWEEN 1 AND 5),
    Fecha_R DATE DEFAULT GETDATE()
);


-- Tipo de tabla para pasar lista de productos
CREATE TYPE TipoProductos AS TABLE (
    IdProducto INT,
    Cantidad INT,
    Precio DECIMAL(10,2)
);
GO

CREATE PROCEDURE sp_CrearPedido
    @IdUsuario INT,
    @Direccion NVARCHAR(255),
    @Productos TipoProductos READONLY
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DECLARE @IdPedido INT;

    -- Insertar pedido
    INSERT INTO Pedidos (Id_U, DireccionEnvio_PE)
    VALUES (@IdUsuario, @Direccion);

    SET @IdPedido = SCOPE_IDENTITY();

    -- Insertar detalle del pedido
    INSERT INTO DetallePedido (Id_PE, Id_P, Cantidad_DP, PrecioUnitario_DP)
    SELECT @IdPedido, IdProducto, Cantidad, Precio
    FROM @Productos;

    -- Actualizar stock
    UPDATE PR
    SET Stock_P = Stock_P - P.Cantidad
    FROM Productos PR
    JOIN @Productos P ON PR.Id_P = P.IdProducto;

    COMMIT TRANSACTION;
END;
GO