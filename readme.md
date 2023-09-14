

# Sistema de Gestión de Citas - CampusLands EPS

Este sistema de gestión de citas proporciona una solución eficiente para crear, administrar, consultar y eliminar citas médicas en CampusLands EPS. El sistema se ha desarrollado como un Backend que expone una serie de EndPoints para permitir que el equipo de Front-End construya una interfaz de usuario intuitiva y funcional para el personal administrativo y los pacientes.

## Características Principales

- **Creación de Citas:** Los usuarios autorizados pueden crear nuevas citas médicas, especificando la fecha, el médico y otros detalles relevantes.

- **Administración de Citas:** El sistema permite a los administradores y al personal médico administrar las citas existentes, incluida la capacidad de actualizar detalles o cambiar el estado de una cita.

- **Consulta de Citas:** Los usuarios pueden consultar las citas programadas, filtrarlas por diferentes criterios y ver la información relevante de cada cita.

- **Eliminación de Citas:** Se proporciona una funcionalidad de eliminación de citas, que registra adecuadamente las acciones y eventos relacionados.

## EndPoints Disponibles

El sistema ofrece una serie de EndPoints para facilitar la interacción entre el Front-End y el Back-End. Algunos de los EndPoints principales incluyen:

1. `/ordenAlfa`: Obtener todos los pacientes de manera alfabética.

2. `/citasFecha`: Obtener las citas de una fecha en específico y ordenar los pacientes de manera alfabética.

3. `/medicos-especialidad/:nombreEspecialidad`: Obtener todos los médicos de una especialidad en específico.

4. `/encontrar-paciente-proxima`: Encontrar la próxima cita para un paciente en específico.

5. `/encontrar-pacientes`: Encontrar todos los pacientes que tienen citas con un médico en específico.

6. `/encontrarCita-dia`: Encontrar todas las citas de un día en específico.

7. `/obtener-medicos`: Obtener todos los médicos con sus consultorios correspondientes.

8. `/numero-citas-medico`: Contar el número de citas que un médico tiene en un día específico.

9. `/consultorios-citas-ya`: Obtener lo/s consultorio/s donde se aplicaron las citas de un paciente.

10. `/citas-por-genero`: Obtener todas las citas realizadas por los pacientes de acuerdo al género registrado, siempre y cuando el estado de la cita se encuentra registrada como "Atendida".

11. `/insertar-paciente`: Insertar un paciente en la tabla de usuarios, con validación para menores de edad y acudientes.

12. `/citas-rechazadas`: Mostrar todas las citas que fueron rechazadas de un mes en específico.

Estos EndPoints cubren una amplia gama de funcionalidades para tu sistema de gestión de citas en CampusLands EPS. Puedes utilizarlos como referencia para desarrollar las rutas y funcionalidades correspondientes en tu aplicación. Asegúrate de documentar adecuadamente cada uno de ellos para facilitar su uso por parte del equipo de Front-End.

## Uso del Sistema

Para utilizar el sistema de gestión de citas, el equipo de Front-End debe integrar estos EndPoints en la interfaz de usuario. Los usuarios autorizados pueden iniciar sesión en el sistema para acceder a estas funcionalidades y administrar las citas de manera efectiva.

## Requisitos del Sistema

El sistema se ha desarrollado utilizando tecnologías modernas y se espera que funcione en una infraestructura de servidor adecuada. A continuación, se detallan los principales requisitos:

- Node.js y Express.js para el servidor.
- MongoDB como base de datos para almacenar información de citas, médicos y pacientes.
- Autenticación y autorización para garantizar la seguridad y el acceso controlado.
- Registro de eventos y acciones para mantener un historial de cambios en las citas.


## Configuración del Proyecto

## Clona el git

  `git clone https://github.com/tu-usuario/campuslands-eps.git`

  ` cd Microservicio-CL-EPS`
 
 ## Descargar dependencias 
  ` npm install ` 
 
 ## Correr el microservicio
 ` npm dev  `
