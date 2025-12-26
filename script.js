document.addEventListener('DOMContentLoaded', () => {
    const selectorCards = document.querySelectorAll('.pizza-option-card');
    const makeOrderBtn = document.getElementById('makeOrderBtn');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const deliveryOptions = document.querySelectorAll('input[name="entrega"]');
    const deliveryNote = document.getElementById('delivery-note');
    const whatsappFloat = document.getElementById('whatsappFloat'); // Botón flotante
    
    const phoneNumber = '1161915635';

    const prices = {
        "Muzzarella": 7000,
        "Napolitana": 8500,
        "Jamón y Morrón": 8500,
        "Fugazzeta": 7500
    };

    let order = {};

    selectorCards.forEach(card => {
        const pizzaName = card.dataset.pizza;
        const qtyInput = card.querySelector('.qty-input');
        const minusBtn = card.querySelector('.qty-minus');
        const plusBtn = card.querySelector('.qty-plus');

        const updateOrder = (newQty) => {
            newQty = parseInt(newQty);
            if (newQty > 0) {
                order[pizzaName] = newQty;
            } else {
                delete order[pizzaName];
            }
            updateUI();
        };

        minusBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 0) {
                currentQty--;
                qtyInput.value = currentQty;
                updateOrder(currentQty);
            }
        });

        plusBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            currentQty++;
            qtyInput.value = currentQty;
            updateOrder(currentQty);
        });
    });

    deliveryOptions.forEach(opt => {
        opt.addEventListener('change', () => {
            deliveryNote.style.display = (opt.value === 'Envío a domicilio') ? 'block' : 'none';
        });
    });

    const updateUI = () => {
        let total = 0;
        let totalItems = 0;

        for (const pizza in order) {
            total += order[pizza] * prices[pizza];
            totalItems += order[pizza];
        }

        totalPriceDisplay.innerText = `$${total.toLocaleString('es-AR')}`;
        makeOrderBtn.disabled = totalItems === 0;
    };

    const buildWhatsappLink = () => {
        const deliveryMethod = document.querySelector('input[name="entrega"]:checked').value;
        let totalOrderPrice = 0;
        
        let message = "¡Hola Tola's Pizzas! Quisiera hacer el siguiente pedido:\n\n";
        
        for (const pizza in order) {
            const subtotal = order[pizza] * prices[pizza];
            message += `🍕 ${order[pizza]} x ${pizza} ($${subtotal.toLocaleString('es-AR')})\n`;
            totalOrderPrice += subtotal;
        }

        message += `\n🛵 *Método de entrega:* ${deliveryMethod}`;
        message += `\n💰 *Total pedido:* $${totalOrderPrice.toLocaleString('es-AR')}`;
        
        if (deliveryMethod === 'Envío a domicilio') {
            message += "\n\n(A la espera de confirmar dirección para el costo del envío)";
        } else {
            message += "\n\n¿Me podrías pasar la dirección exacta para retirar?";
        }

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

    makeOrderBtn.addEventListener('click', () => {
        window.open(buildWhatsappLink(), '_blank');
    });

    // Ajuste de seguridad para el botón flotante
    if (whatsappFloat) {
        const defaultMessage = encodeURIComponent("¡Hola Tola's! Me contacto desde la web para hacer un pedido o una consulta.");
        whatsappFloat.href = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
    }
});