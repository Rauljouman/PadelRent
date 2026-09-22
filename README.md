# PadelRent 🎾

PadelRent es una aplicación web para reservar pistas de pádel online.

La idea de este proyecto era desarrollar una aplicación que simulara el funcionamiento de un club de pádel, desde el registro de un usuario hasta la reserva de una pista, el pago y la consulta de su comprobante.

También he añadido un pequeño panel de administración para gestionar las pistas y los permisos de los usuarios.

Es un proyecto personal que he desarrollado para seguir practicando .NET y React, trabajar con una base de datos real y entender mejor cómo conectar todas las partes de una aplicación Full Stack.

## Demo

**Aplicación:** https://padelrent-n3f6dn170-rauljoumans-projects.vercel.app

> El proyecto está alojado en servicios gratuitos, por lo que algunas peticiones pueden tardar unos segundos en responder, especialmente después de un periodo de inactividad.

## Tecnologías utilizadas

### Backend

- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT para autenticación y autorización
- BCrypt para las contraseñas
- Stripe API para los pagos de prueba

### Frontend

- React
- Vite
- JavaScript
- React Router
- CSS
- Lucide React
- Fetch API

### Base de datos y despliegue

- Supabase PostgreSQL
- Render para el backend
- Vercel para el frontend
- Stripe Checkout en modo test

## Funcionalidades

### Usuarios

Los usuarios pueden registrarse, iniciar sesión y acceder a las funcionalidades privadas de la aplicación.

También pueden consultar su perfil, modificar su nombre y teléfono, consultar un resumen de sus reservas y recuperar la contraseña mediante un flujo de demostración.

La autenticación se realiza mediante JWT y las contraseñas se almacenan utilizando BCrypt.

### Disponibilidad y reservas

El usuario puede consultar las pistas disponibles seleccionando una fecha y una duración de 60 o 90 minutos.

El horario configurado es de 10:00 a 21:00.

La aplicación comprueba las reservas existentes para evitar que dos usuarios puedan reservar una misma pista en horarios que se solapen.

Cuando se crea una reserva, queda en estado pendiente y se bloquea temporalmente durante 10 minutos mientras el usuario realiza el pago.

Si el tiempo expira, deja de bloquear la disponibilidad.

### Pagos

He integrado Stripe Checkout en modo test para simular el pago de las reservas.

Cuando Stripe confirma que el pago se ha completado correctamente, la reserva pasa a estado pagada y se genera un comprobante.

No se realizan cargos reales.

### Mis reservas

Cada usuario tiene una sección donde puede consultar su historial de reservas.

Desde allí puede:

- Consultar las reservas realizadas.
- Ver el estado de cada reserva.
- Pagar reservas pendientes que todavía no hayan expirado.
- Cancelar reservas pendientes.
- Consultar los comprobantes de las reservas pagadas.

### Panel de administración

He añadido un panel de administración con funcionalidades exclusivas para los usuarios que tienen el rol de administrador.

Desde este panel se pueden activar o desactivar pistas completas.

Por ejemplo, si una pista está en mantenimiento o no puede utilizarse, el administrador puede desactivarla y dejará de aparecer en la disponibilidad para nuevas reservas.

También se pueden gestionar los permisos de los usuarios.

Un administrador puede conceder o retirar el rol de administrador a otros usuarios registrados.

Estas acciones están protegidas en el backend mediante autorización basada en roles.

## Estados de las reservas

Las reservas pueden encontrarse en tres estados:

| Estado | Descripción |
|---|---|
| Pendiente | La reserva está creada, pero todavía no se ha pagado. |
| Pagada | El pago de prueba se ha confirmado correctamente. |
| Cancelada | La reserva se ha cancelado o ha expirado el plazo de pago. |

## Cómo funciona

El flujo principal de la aplicación es:

1. El usuario crea una cuenta o inicia sesión.
2. Selecciona una fecha y una duración.
3. Consulta las pistas disponibles.
4. Selecciona una pista y un horario.
5. Confirma la reserva.
6. Realiza el pago mediante Stripe Checkout.
7. Consulta su reserva y el comprobante generado.

El administrador dispone de funcionalidades adicionales para gestionar las pistas y los permisos de otros usuarios.

## Probar los pagos

Los pagos se realizan en modo test utilizando Stripe.

Para probar el proceso se puede utilizar la siguiente tarjeta de prueba:

Número: 4242 4242 4242 4242

Fecha de caducidad: cualquier fecha futura

CVC: cualquier código de tres dígitos

No se realizan cargos reales.

## Estructura del proyecto

El proyecto está dividido en dos partes principales:

PadelRent/
│
├── backend/
│   └── PadelRent.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Enums/
│       ├── Migrations/
│       ├── Models/
│       ├── Services/
│       └── Program.cs
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── styles/
    │
    └── package.json


El backend contiene la lógica de negocio, la autenticación, las validaciones, el acceso a la base de datos y la integración con Stripe.

El frontend se encarga de mostrar la información y permitir que el usuario interactúe con las diferentes funcionalidades de la aplicación.

## Qué he aprendido

Este proyecto me ha servido para practicar el desarrollo de una aplicación Full Stack y conectar distintas tecnologías dentro de un mismo flujo.

He trabajado con Entity Framework Core, relaciones entre entidades, consultas a PostgreSQL, APIs REST y autenticación mediante JWT.

También he profundizado en la autorización por roles, el control de disponibilidad y las validaciones necesarias para evitar reservas duplicadas.

Una de las partes que más me ha servido ha sido integrar Stripe, ya que he tenido que conectar la creación de una reserva con el pago y actualizar su estado una vez confirmado.

En el frontend he seguido practicando React, el manejo de estados, las llamadas a la API, las rutas protegidas y el diseño responsive.

Además, desplegar el frontend y el backend en servicios diferentes me ha permitido trabajar con variables de entorno, CORS y configuración de producción.

## Posibles mejoras futuras

Aunque el flujo principal ya funciona, hay funcionalidades que me gustaría seguir desarrollando:

- Bloqueo de pistas por franjas horarias concretas.
- Gestión de reservas desde el panel de administración.
- Envío real de correos electrónicos.
- Invitaciones a nuevos administradores mediante email.
- Eliminación de cuentas desde el perfil.
- Tests unitarios y de integración.
- Mejoras de rendimiento y experiencia de usuario.
- Gestión de diferentes clubes o instalaciones deportivas.

## Estado del proyecto

PadelRent se encuentra en una versión funcional desarrollada para portfolio.

Permite probar el proceso completo de reserva, pago y consulta de comprobantes, además de incluir un panel básico de administración.

No es una aplicación destinada a gestionar reservas comerciales reales, sino un proyecto personal con el que seguir aprendiendo y demostrar los conocimientos adquiridos durante su desarrollo.
