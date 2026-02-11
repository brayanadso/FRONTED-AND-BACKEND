import pedidos from "../models/pedidos.js";

// crear nuevo pedido
export const crearPedido = async (req, res) => {
    try {
        const { userId, productos, nombreCliente, telefono, total,} = req.body;

        if (!userId || !productos || productos.length === 0) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const nuevoPedido = new pedidos({
            userId,
            productos,
            nombreCliente,
            telefono,
            total,
            estado: "pendiente"
        });

        await nuevoPedido.save();

        res.status(201).json({
            message: "Pedido creado con éxito",
            pedido: nuevoPedido
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error al crear el pedido" });
    }
};

// obtener pedidos por usuario
export const obtenerpedidousuarioId = async (req, res) => {
    try {
        const { userId } = req.params;

        const pedidosUsuario = await pedidos.find({ userId });

        res.json(pedidosUsuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos del usuario" });
    }
};

// obtener un pedido por id
export const obtenerpedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await pedidos.findById(id);

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

// actualizar estado
export const actualizarEstadopedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const pedidoActualizado = await pedidos.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json({
            message: "Estado actualizado",
            pedido: pedidoActualizado
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado" });
    }
};