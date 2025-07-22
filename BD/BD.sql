-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_meniu
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias_productos`
--

DROP TABLE IF EXISTS `categorias_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_productos` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `activa` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_productos`
--

LOCK TABLES `categorias_productos` WRITE;
/*!40000 ALTER TABLE `categorias_productos` DISABLE KEYS */;
INSERT INTO `categorias_productos` VALUES (1,'Bebidas',1),(2,'Comida',1),(3,'Postres',1),(4,'Acompañamientos',1);
/*!40000 ALTER TABLE `categorias_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emails`
--

DROP TABLE IF EXISTS `emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emails` (
  `id_email` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id_email`),
  KEY `FK_69d79fa6d9b967da13251f13a8e` (`id_usuario`),
  CONSTRAINT `FK_69d79fa6d9b967da13251f13a8e` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emails`
--

LOCK TABLES `emails` WRITE;
/*!40000 ALTER TABLE `emails` DISABLE KEYS */;
INSERT INTO `emails` VALUES (1,2,'alex@mail.com'),(2,3,'juan@mail.com'),(3,4,'juan@restaurante.com');
/*!40000 ALTER TABLE `emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesas`
--

DROP TABLE IF EXISTS `mesas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesas` (
  `id_mesa` int NOT NULL AUTO_INCREMENT,
  `id_restaurante` int DEFAULT NULL,
  `numero_mesa` int NOT NULL,
  `qr_code` varchar(255) NOT NULL,
  `estado_mesa` varchar(50) NOT NULL,
  PRIMARY KEY (`id_mesa`),
  KEY `FK_ef6c79f0f13ec986fe1730a42e4` (`id_restaurante`),
  CONSTRAINT `FK_ef6c79f0f13ec986fe1730a42e4` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesas`
--

LOCK TABLES `mesas` WRITE;
/*!40000 ALTER TABLE `mesas` DISABLE KEYS */;
INSERT INTO `mesas` VALUES (1,1,2,'/uploads/mesas/Captura desde 2025-06-04 15-18-33.png','Disponible'),(2,1,3,'/uploads/mesas/qr_1752141454857.png','Disponible'),(3,1,6,'/uploads/mesas/qr_1752194740650.png','Ocupada');
/*!40000 ALTER TABLE `mesas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodo_pago`
--

DROP TABLE IF EXISTS `metodo_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `nombre_propietario` varchar(100) NOT NULL,
  `numero_tarjeta` varchar(20) NOT NULL,
  `cvv` varchar(5) NOT NULL,
  `mes_expiracion` int NOT NULL,
  `anio_expiracion` int NOT NULL,
  `activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_metodo_pago`),
  KEY `FK_c0edf0d8cb79276cb42192511f4` (`id_usuario`),
  CONSTRAINT `FK_c0edf0d8cb79276cb42192511f4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodo_pago`
--

LOCK TABLES `metodo_pago` WRITE;
/*!40000 ALTER TABLE `metodo_pago` DISABLE KEYS */;
INSERT INTO `metodo_pago` VALUES (1,4,'Juan Pérez','4111111111111111','123',12,2025,1);
/*!40000 ALTER TABLE `metodo_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_items`
--

DROP TABLE IF EXISTS `orden_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden_items` (
  `id_orden_item` int NOT NULL AUTO_INCREMENT,
  `id_orden` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_orden_item`),
  KEY `FK_6628deaf82f2455650463fbdcf7` (`id_orden`),
  KEY `FK_23585639c0bf1314894d9f298fb` (`id_producto`),
  CONSTRAINT `FK_23585639c0bf1314894d9f298fb` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `FK_6628deaf82f2455650463fbdcf7` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_items`
--

LOCK TABLES `orden_items` WRITE;
/*!40000 ALTER TABLE `orden_items` DISABLE KEYS */;
INSERT INTO `orden_items` VALUES (1,1,2,2,2.50),(2,1,1,1,67.50),(3,2,3,1,3.50),(4,2,14,1,565.25),(5,3,3,1,3.50),(6,3,14,1,565.25),(7,4,3,1,3.50),(8,4,14,1,565.25),(9,5,3,1,3.50),(10,5,14,1,565.25),(11,6,9,1,4.00),(12,6,8,1,5.50);
/*!40000 ALTER TABLE `orden_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `id_orden` int NOT NULL AUTO_INCREMENT,
  `id_restaurante` int DEFAULT NULL,
  `id_mesa` int DEFAULT NULL,
  `estado` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hora_confirmacion` time DEFAULT NULL,
  `hora_lista` time DEFAULT NULL,
  `hora_entregada` time DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `solicitud_pago` tinyint NOT NULL DEFAULT '0',
  `notas` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_orden`),
  KEY `FK_9d5704714e038787cc5e8e3c831` (`id_restaurante`),
  KEY `FK_62ad6d2a5d8a8843d98d2bbf394` (`id_mesa`),
  CONSTRAINT `FK_62ad6d2a5d8a8843d98d2bbf394` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`),
  CONSTRAINT `FK_9d5704714e038787cc5e8e3c831` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
INSERT INTO `ordenes` VALUES (1,1,2,'PENDIENTE','2025-07-14 18:04:08','18:04:07',NULL,NULL,72.50,10.88,83.38,0,'Sin picante'),(2,1,2,'PENDIENTE','2025-07-14 18:23:50','18:23:49',NULL,NULL,568.75,85.31,654.06,0,'Queso'),(3,1,2,'PENDIENTE','2025-07-14 18:25:18','18:25:18',NULL,NULL,568.75,85.31,654.06,0,'Queso'),(4,1,2,'PENDIENTE','2025-07-14 18:30:08','18:30:07',NULL,NULL,568.75,85.31,654.06,0,'Queso'),(5,1,2,'PENDIENTE','2025-07-14 18:32:13','18:32:12',NULL,NULL,568.75,85.31,654.06,0,'Queso'),(6,1,2,'PENDIENTE','2025-07-14 18:36:02','18:36:01',NULL,NULL,9.50,1.43,10.93,0,'Queso');
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personas` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  PRIMARY KEY (`id_persona`),
  KEY `FK_8119d9635757d434ba622f004ba` (`id_usuario`),
  CONSTRAINT `FK_8119d9635757d434ba622f004ba` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personas`
--

LOCK TABLES `personas` WRITE;
/*!40000 ALTER TABLE `personas` DISABLE KEYS */;
INSERT INTO `personas` VALUES (1,2,'Alex','Diaz'),(2,3,'Juan','Pérez'),(3,4,'Juan','Pérez');
/*!40000 ALTER TABLE `personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes`
--

DROP TABLE IF EXISTS `planes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes` (
  `id_plan` int NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(100) NOT NULL,
  `numero_mesas` int NOT NULL,
  `numero_productos` int NOT NULL,
  `numero_cocineros` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes`
--

LOCK TABLES `planes` WRITE;
/*!40000 ALTER TABLE `planes` DISABLE KEYS */;
INSERT INTO `planes` VALUES (1,'Premium',20,100,2,500.00);
/*!40000 ALTER TABLE `planes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_restaurante` int DEFAULT NULL,
  `id_subcategoria` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_producto`),
  KEY `FK_dacdbb027704230ace10574ff0f` (`id_restaurante`),
  KEY `FK_c08d9458f63e85e6396cd43ea81` (`id_subcategoria`),
  CONSTRAINT `FK_c08d9458f63e85e6396cd43ea81` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategorias_productos` (`id_subcategoria`),
  CONSTRAINT `FK_dacdbb027704230ace10574ff0f` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,1,'Fanta','Refresco',67.50,'/uploads/productos/Captura desde 2025-06-02 23-57-44.png',1),(2,1,1,'Sprite','Refresco de limón 500ml',2.50,'sprite.jpg',1),(3,1,2,'Heineken','Cerveza rubia 330ml',3.50,'heineken.jpg',1),(4,1,3,'Vino tinto reserva','Vino tinto de la casa 750ml',15.00,'vino_tinto.jpg',1),(5,1,4,'Nachos con queso','Nachos crujientes con salsa de queso fundido',600.20,'nachos.jpg',1),(6,1,5,'Pasta Carbonara','Pasta con salsa cremosa de huevo, queso y panceta',12.00,'carbonara.jpg',1),(7,1,6,'Ensalada César','Ensalada con pollo, croutons y aderezo césar',8.50,'cesar.jpg',1),(8,1,7,'Tarta de chocolate','Deliciosa tarta de chocolate negro',5.50,'tarta_chocolate.jpg',1),(9,1,8,'Helado de vainilla','Helado artesanal de vainilla',4.00,'helado_vainilla.jpg',1),(10,1,9,'Papas fritas','Porción de papas fritas crujientes',3.50,'papas_fritas.jpg',1),(11,1,10,'Arroz blanco','Arroz blanco cocido al vapor',2.50,'arroz_blanco.jpg',1),(12,2,NULL,'Pollo masala','Pollo Hindu',600.20,'/uploads/Captura desde 2025-07-05 19-09-45.png',0),(13,2,NULL,'Carnes frias','Carne de Res',500.20,'/uploads/Captura desde 2025-06-20 21-24-07.png',1),(14,1,2,'Poolo','HG',565.25,'/uploads/Captura desde 2025-06-02 23-57-44.png',1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_complementos`
--

DROP TABLE IF EXISTS `productos_complementos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_complementos` (
  `id_producto_principal` int NOT NULL,
  `id_producto_complemento` int NOT NULL,
  PRIMARY KEY (`id_producto_principal`,`id_producto_complemento`),
  KEY `FK_064945b8906bc61231613d67a33` (`id_producto_complemento`),
  CONSTRAINT `FK_064945b8906bc61231613d67a33` FOREIGN KEY (`id_producto_complemento`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `FK_57af7862ec72b3c017ac8f8e785` FOREIGN KEY (`id_producto_principal`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_complementos`
--

LOCK TABLES `productos_complementos` WRITE;
/*!40000 ALTER TABLE `productos_complementos` DISABLE KEYS */;
INSERT INTO `productos_complementos` VALUES (5,1),(5,3);
/*!40000 ALTER TABLE `productos_complementos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurantes`
--

DROP TABLE IF EXISTS `restaurantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurantes` (
  `id_restaurante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_restaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurantes`
--

LOCK TABLES `restaurantes` WRITE;
/*!40000 ALTER TABLE `restaurantes` DISABLE KEYS */;
INSERT INTO `restaurantes` VALUES (1,'La Terraza Gourmet','reservas@laterrazagourmet.com','Avenida del Mar 45, Playa Ejemplo','+34 600 123 456','https://ejemplo.com/logos/terraza-gourmet.jpg','Elegante restaurante con terraza al mar especializado en pescados y mariscos frescos. Menú degustación disponible.','2025-07-05 20:06:24',1),(2,'Mi Restaurante','restaurante@example.com','Calle Principal 123','5512345678','/uploads/restaurantes/logo_1752210078835.png','Restaurante de comida tradicional','2025-07-10 23:01:18',1);
/*!40000 ALTER TABLE `restaurantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Gerente'),(2,'Cajero');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategorias_productos`
--

DROP TABLE IF EXISTS `subcategorias_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategorias_productos` (
  `id_subcategoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `activa` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_subcategoria`),
  KEY `FK_b8ef0c0d05af65a52ede25840a9` (`id_categoria`),
  CONSTRAINT `FK_b8ef0c0d05af65a52ede25840a9` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_productos` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategorias_productos`
--

LOCK TABLES `subcategorias_productos` WRITE;
/*!40000 ALTER TABLE `subcategorias_productos` DISABLE KEYS */;
INSERT INTO `subcategorias_productos` VALUES (1,1,'Refrescos',1),(2,1,'Cervezas',1),(3,1,'Vinos',1),(4,2,'Entradas',1),(5,2,'Platos principales',1),(6,2,'Ensaladas',1),(7,3,'Pasteles',1),(8,3,'Helados',1),(9,4,'Papas fritas',1),(10,4,'Arroces',1);
/*!40000 ALTER TABLE `subcategorias_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripciones`
--

DROP TABLE IF EXISTS `suscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripciones` (
  `id_suscripcion` int NOT NULL AUTO_INCREMENT,
  `id_restaurante` int DEFAULT NULL,
  `id_metodo_pago` int DEFAULT NULL,
  `id_plan` int DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_cobro` date NOT NULL,
  `activa` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_suscripcion`),
  KEY `FK_470da767fd9f13723c44bb9cbbb` (`id_restaurante`),
  KEY `FK_4cdc00eb1ca0c4968cdf8f33359` (`id_metodo_pago`),
  KEY `FK_bf28ca40c9718682e59dc8f6b24` (`id_plan`),
  CONSTRAINT `FK_470da767fd9f13723c44bb9cbbb` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`),
  CONSTRAINT `FK_4cdc00eb1ca0c4968cdf8f33359` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`),
  CONSTRAINT `FK_bf28ca40c9718682e59dc8f6b24` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripciones`
--

LOCK TABLES `suscripciones` WRITE;
/*!40000 ALTER TABLE `suscripciones` DISABLE KEYS */;
INSERT INTO `suscripciones` VALUES (1,2,1,1,'2025-07-10','2025-08-09',1);
/*!40000 ALTER TABLE `suscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int DEFAULT NULL,
  `id_restaurante` int NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  KEY `FK_98bf89ebf4b0be2d3825f54e56c` (`id_rol`),
  KEY `FK_5496b7ef4828bda85520b271334` (`id_restaurante`),
  CONSTRAINT `FK_5496b7ef4828bda85520b271334` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`),
  CONSTRAINT `FK_98bf89ebf4b0be2d3825f54e56c` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,1,'admin','$2b$10$aV9vaCaFaZL9R1jM/ETCXeA3DGS0EbnihKuvtoyPI/72/t6lsTR/2','2025-07-05 20:06:24',1),(2,1,1,'AlexDiaz564','$2b$10$62.ANnPUloCv7/xKpM0MyexXuxjL/SlOAS3vRNw/PEtepBlkmiYeG','2025-07-08 14:12:17',1),(3,2,1,'JuanPérez676','$2b$10$wVAsvVycHyoWFYT7wijwKO9DUHw5fKOZt1Y0WekN3RRWHTubEh0LG','2025-07-08 14:21:40',1),(4,1,2,'juan','$2b$10$RsmsdGJ2vOHHMLeR.FOV2.NZFhUPlBQ4OkL/G6/9VDbK/rlBlmhka','2025-07-10 23:01:18',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21 20:47:56
