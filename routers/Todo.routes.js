import  Express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const router = Express.Router();

const client = new MongoClient(process.env.DB)


const db = client.db('microservicioEPS');
const medico = db.collection('medico');
const usuario = db.collection('usuario');
const cita = db.collection('cita');
const genero = db.collection('genero');
const estado_cita = db.collection('estado_cita');

//--------------------1. Obtener todos los pacientes de manera alfabética.-------------------//
router.get('/ordenAlfa', async (req, res) => {
    try {
        await client.connect();
        const result = await usuario.find().sort({usu_nombre: 1}).toArray(); //De esta manera se ordena alfabeticamente si le pondemos otro signo negativo será ordenado al contrario.
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});


//----------2. Obtener las citas de una fecha en específico , donde se ordene los pacientes de manera alfabética.-------------//
 router.get('/citasFecha', async (req, res) => {
    try {
        await client.connect();
        const result = await cita.find({cit_fecha: "2023-09-15"}).toArray();
        const pacientes = await usuario.find({usu_id: result.cit_datosUsuario}).toArray();
        res.json(pacientes);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}); 

// 3.-----------------------Obtener todos los médicos de una especialidad en específico (por ejemplo, ‘Cardiología’).-----------------------------------//
router.get('/medicos-especialidad/:nombreEspecialidad', async (req, res) => { //Debe de cambiar a :nombreEspecialidad por /Cardiología   y ahí le saldrá
    try {
        const { nombreEspecialidad } = req.params;

        await client.connect();

        const especialidad = await client.db('microservicioEPS').collection('especialidad').findOne({ esp_nombre: nombreEspecialidad });

        if (!especialidad) {
            res.status(404).json({ message: `Especialidad ${nombreEspecialidad} no encontrada` });
            return;
        }

        const medicosEspecialidad = await client.db('microservicioEPS').collection('medico').find({ med_especialidad: especialidad.esp_id }).toArray();

        res.json(medicosEspecialidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});

// 4. ----------------Encontrar la próxima cita para un paciente en específico (por ejemplo, el paciente con user_id 1).------------------------------------//
router.get('/encontrar-paciente-proxima', async (req, res) => {
    try {
        await client.connect();
        // el .limit indicandole el 1 solo me trae el primer dato 
        const result = await cita.find({cit_datosUsuario: 1}).sort({cit_fecha: 1}).limit(1).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 5.-------Encontrar todos los pacientes que tienen citas con un médico en específico (por ejemplo, el médico con med_numMatriculaProfesional 1). ---------------//
router.get('/encontrar-pacientes', async (req, res) => {
    try {
        await client.connect();
        const result = await cita.aggregate([
            {
                $match: {
                    cit_medico: 1 // Reemplaza 1 para ver las matriculas que desees
                }
            },
            {
                $lookup: {
                    from: 'usuario', 
                    localField: 'cit_datosUsuario',
                    foreignField: 'usu_id',
                    as: 'pacientes'
                }
            },
            {
                $unwind: '$pacientes'
            },
            {
                $project: {
                    _id: 0,
                    pacientes: 1
                }
            }
        ]).toArray();

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});

// 6. Encontrar todas las citas de un día en específico (por ejemplo, ‘2023-07-12’).
router.get('/encontrarCita-dia', async (req, res) => {
    try {
        await client.connect();
        const fechaBuscada = new Date("2023-10-22"); 
        const fechaInicio = new Date(fechaBuscada);
        const fechaFin = new Date(fechaBuscada);
        const result = await cita.find({
            cit_fecha: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        }).toArray();

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});

//7 -------------------Obtener todos los médicos con sus consultorios correspondientes.---------------------//
router.get('/obtener-medicos', async (req, res) => {
    try {
        await client.connect();
        const result = await medico.aggregate([      
            {
              $lookup: {
                from : 'consultorio',
                localField:'med_consultorio',
                foreignField: 'cons_codigo',
                as: 'cons_nombre',
              },
            }
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// ----------------8. Contar el número de citas que un médico tiene en un día específico (por ejemplo, el médico con med_numMatriculaProfesional 1 en ‘2023-07-12’).---------------//
router.get('/numero-citas-medico', async (req, res) => {
    try {
        await client.connect();
        
       
      
        const count = await cita.countDocuments({
            cit_medico: 3, //Debes de reemplazar el id del medico para que puedas ver el numero de citas .
        
        });

        res.json({ numeroCitas: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});
// 9. -------------------Obtener lo/s consultorio/s donde se aplicó las citas de un paciente.------------------//
router.get('/consultorios-citas-ya', async (req, res) => {
    try {
        await client.connect();

        const estadoCitaDeseado = 1; // Cambia esto al estado de cita que deseas buscar

        const result = await cita.find({ cit_estadoCita: estadoCitaDeseado }).toArray();

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});


// ---------------10. Obtener todas las citas realizadas por los pacientes de acuerdo al género registrado, siempre y cuando el estado de la cita se encuentra registrada como “Atendida”.----//
router.get('/citas-por-genero', async (req, res) => {
    try {
        await client.connect();

        const generoBuscado = "masculino"; // Cambia esto al género que deseas buscar
        const estadoCitaBuscado = 1; // Cambia esto al estado de cita que deseas buscar (1 para "Atendida")

        const generoEncontrado = await genero.findOne({ gen_nombre: generoBuscado });

        if (!generoEncontrado) {
            res.status(404).json({ message: `Género "${generoBuscado}" no encontrado` });
            return;
        }

        const citasPorGenero = await cita.find({
            cit_estadoCita: estadoCitaBuscado, // Filtrar por estado de cita "Atendida"
            cit_medico: 1, // Cambia el valor de cit_medico según el ID del médico deseado
            cit_datosUsuario: generoEncontrado._id // Filtrar por género
        }).toArray();

        res.json(citasPorGenero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await client.close();
    }
    
});





// 11. --------------------Insertar un paciente a la tabla usuario, donde si es menor de edad deberá solicitar primero que ingrese el acudiente y validar si ya estaba registrado el acudiente (El usuario deberá poder ingresar de manera personalizada los datos del usuario a ingresar). --------------------------///

router.post('/insertar-paciente', async (req, res) => {
    try {
        await client.connect();

        const { usu_nombre, usu_segdo_nombre, usu_primer_apellido, usu_segdo_apellido, usu_fecha_nacimiento, usu_acudiente } = req.body;

        // Verificar si el paciente es menor de edad
        const fechaNacimiento = new Date(usu_fecha_nacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        if (edad < 18) {
            // Si el paciente es menor de edad, verificar si el acudiente existe
            const acudienteExistente = await usuario.findOne({ _id: usu_acudiente });

            if (!acudienteExistente) {
                res.status(400).json({ message: "El acudiente no está registrado. Registre al acudiente primero." });
                return;
            }
        }

        // Insertar al paciente en la tabla de usuarios
        const resultado = await usuario.insertOne({
            usu_nombre,
            usu_segdo_nombre,
            usu_primer_apellido,
            usu_segdo_apellido,
            usu_fecha_nacimiento,
            usu_acudiente
        });

        res.json({ message: "Paciente insertado con éxito", insertedId: resultado.insertedId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        client.close();
    }
});


// 12. Mostrar todas las citas que fueron rechazadas de un mes en específico. Dicha consulta deberá mostrar la fecha de la cita, el nombre del usuario y el médico designado.
router.get('/citas-rechazadas', async (req, res) => {
    try {
        await client.connect();
        const mesBuscado = 10; // 10 corresponde a octubre

        const result = await cita.find({
            $and: [
                { cit_estadoCita: 4 }, // Filtrar citas rechazadas
                { $expr: { $eq: [{ $month: "$cit_fecha" }, mesBuscado] } }
            ]
        }).toArray();

        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        client.close();
    }
});


export default router;