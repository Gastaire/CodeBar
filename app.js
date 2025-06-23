document.addEventListener('DOMContentLoaded', () => {
    const listaProductosEl = document.getElementById('lista-productos');
    const buscadorEl = document.getElementById('buscador');
    let todosLosProductos = [];

    // 1. Cargar los productos desde el archivo JSON
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            todosLosProductos = data;
            mostrarProductos(todosLosProductos);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            listaProductosEl.innerHTML = '<p>No se pudieron cargar los productos. Asegúrate de que el archivo productos.json existe.</p>';
        });

    // 2. Función para mostrar los productos en la página
    function mostrarProductos(productos) {
        listaProductosEl.innerHTML = ''; // Limpiar la lista actual

        if (productos.length === 0) {
            listaProductosEl.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';

            // Crear un ID único para el contenedor del código de barras
            const barcodeId = `barcode-${producto.A_COD}`;

            card.innerHTML = `
                <div class="producto-info">
                    <h2>${producto.A_DET}</h2>
                    <p>Código: ${producto.A_COD}</p>
                </div>
                <div class="producto-barcode">
                    <svg id="${barcodeId}"></svg>
                </div>
            `;
            listaProductosEl.appendChild(card);

            // 3. Generar el código de barras para este producto
            try {
                JsBarcode(`#${barcodeId}`, producto.A_CODBARRA, {
                    format: "EAN13", // O el formato que usen, EAN13 es común
                    displayValue: true, // Muestra el número debajo del código
                    fontSize: 14,
                    lineColor: "#000",
                    width: 2,
                    height: 60,
                    margin: 10
                });
            } catch (e) {
                console.error(`No se pudo generar el código de barras para ${producto.A_CODBARRA}:`, e);
                // Si hay un error (ej. código inválido), mostrar un mensaje
                document.getElementById(barcodeId).outerHTML = `<p style="color:red; font-size:12px;">Código de barras inválido</p>`;
            }
        });
    }

    // 4. Lógica del buscador
    buscadorEl.addEventListener('input', (e) => {
        const terminoBusqueda = e.target.value.toLowerCase();
        
        const productosFiltrados = todosLosProductos.filter(producto => {
            const nombre = producto.A_DET ? producto.A_DET.toLowerCase() : '';
            const codigo = producto.A_COD ? producto.A_COD.toLowerCase() : '';
            return nombre.includes(terminoBusqueda) || codigo.includes(terminoBusqueda);
        });
        
        mostrarProductos(productosFiltrados);
    });
});