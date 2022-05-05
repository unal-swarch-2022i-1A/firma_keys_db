-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-03-2022 a las 03:22:10
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restapi_nodejs_express`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `firma_keys`
--

CREATE TABLE `firma_keys` (
  `id` integer(10) UNSIGNED NOT NULL,
  `public` LongBlob(2048) UNSIGNED NOT NULL,
  `private` LongBlob(2048) UNSIGNED NOT NULL
);

--
-- Volcado de datos para la tabla `firma_keys`
--

-- INSERT INTO `firma_keys` (`id`, `name`, `programmers`) VALUES
-- (1, 'JavaScript', 12),
-- (2, 'Python', 21),
-- (4, 'PHP', 50),
-- (6, 'C# .NET', 45);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `firma_keys`
--
ALTER TABLE `firma_keys`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `firma_keys`
--
ALTER TABLE `firma_keys`
  MODIFY `id` integer(10) UNSIGNED NOT NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;