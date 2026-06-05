

class EstrategiaPago {
    calcularTotal(montoBase) {
        throw new Error("El método calcularTotal debe ser implementado");
    }
}

// Estrategia 1: Efectivo (Ejemplo: 10% de descuento)
class PagoEfectivo extends EstrategiaPago {
    calcularTotal(montoBase) {
        return montoBase * 0.90; 
    }
}

// Estrategia 2: Tarjeta (Ejemplo: 15% de recargo)
class PagoTarjeta extends EstrategiaPago {
    calcularTotal(montoBase) {
        return montoBase * 1.15;
    }
}

// Estrategia 3: Transferencia (Sin recargo ni descuento)
class PagoTransferencia extends EstrategiaPago {
    calcularTotal(montoBase) {
        return montoBase;
    }
}

module.exports = {
    PagoEfectivo,
    PagoTarjeta,
    PagoTransferencia
};