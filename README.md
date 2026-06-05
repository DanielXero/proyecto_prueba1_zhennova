# 💻 Zhennova - E-commerce de Insumos de Hardware

Zhennova es una plataforma web orientada a la venta y gestión de componentes informáticos. Este proyecto está desarrollado como Trabajo de Campo para la cátedra de Ingeniería de Software II de la Universidad Nacional del Nordeste (UNNE).

---

## 🚀 Sobre el Proyecto


### 🛠️ Stack Tecnológico Principal

*   **Node.js & Express**
*   **PostgreSQL** Base de datos relacional para gestión estricta de inventarios y órdenes.
*   **Sequelize ORM** Modelado de datos, relaciones (Associations) y validaciones.
*   **Seguridad**
    *   `JWT` (JSON Web Tokens) para gestión de sesiones.
    *   `Bcrypt` para hasheado de contraseñas.
    *   `Joi` para validación estricta de datos de entrada.

---

## ⚙️ Arquitectura (Patrón MVC)



* **Modelos (`/models`):** Contienen la lógica de datos y las asociaciones de Sequelize (Usuarios, Roles, Productos, Categorías, Carritos, Pedidos, DetallePedidos).
* **Controladores (`/controllers`):** Contienen la lógica de negocio y procesan las peticiones del cliente (ej. `productoController.js`).
* **Rutas (`/routes`):** Actúan como puntos de entrada (endpoints) que dirigen las peticiones a los controladores correspondientes.

---