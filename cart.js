import { initMapModal } from './map.js';

function initCart(showNotification) {
    const cartToggleButtons = document.querySelectorAll('.cart-toggle');
    const closeCartButton = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const menuGrid = document.getElementById('menu-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEls = document.querySelectorAll('.cart-count');
    const cartTotalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const deliveryCheckbox = document.getElementById('delivery-checkbox');
    const deliveryAddressContainer = document.getElementById('delivery-address-container');
    const deliveryAddressInput = document.getElementById('delivery-address');
    const useMapBtn = document.getElementById('use-map-btn');

    let cart = [];
    const DELIVERY_FEE = 10.00;
    let audioContext;
    let addToCartBuffer;

    // Initialize AudioContext on first user interaction
    const initAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            fetch('add-to-cart-sound.mp3')
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data))
                .then(buffer => {
                    addToCartBuffer = buffer;
                })
                .catch(e => console.error("Error loading audio file", e));
        }
    };
    
    document.body.addEventListener('click', initAudio, { once: true });

    const playSound = (buffer) => {
        if (!audioContext || !buffer) return;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    };

    // The mobile buttons are now in the header, not the side panel.
    // cartToggleButtons now correctly selects all cart buttons.
    cartToggleButtons.forEach(button => {
        button.addEventListener('click', () => cartSidebar.classList.toggle('open'));
    });
    closeCartButton.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Event delegation for dynamically added menu items
    if (menuGrid) {
        menuGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.add-to-cart-btn');
            if (button) {
                const listItem = button.closest('li');
                const itemName = listItem.dataset.item;
                const itemPrice = parseFloat(listItem.dataset.price);
                
                addItemToCart(itemName, itemPrice);
                playSound(addToCartBuffer);
                showNotification(`${itemName} added to cart!`);

                // Optional: visual feedback
                button.style.transform = 'scale(1.2)';
                setTimeout(() => button.style.transform = 'scale(1)', 200);
            }
        });
    }

    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                count += item.quantity;
                
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="cart-item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button data-index="${index}" class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-index="${index}" class="quantity-btn increase">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        const isDelivery = deliveryCheckbox.checked;
        const total = isDelivery ? subtotal + DELIVERY_FEE : subtotal;
        
        cartCountEls.forEach(el => el.textContent = count);
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }
    
    cartItemsContainer.addEventListener('click', e => {
        if(e.target.classList.contains('quantity-btn')){
            const index = parseInt(e.target.dataset.index);
            if(e.target.classList.contains('increase')){
                cart[index].quantity++;
            } else if(e.target.classList.contains('decrease')){
                cart[index].quantity--;
                if(cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
            updateCartUI();
        }
    });

    deliveryCheckbox.addEventListener('change', () => {
        deliveryAddressContainer.classList.toggle('hidden-delivery-address', !deliveryCheckbox.checked);
        updateCartUI();
    });

    if (useMapBtn) {
        initMapModal((address) => {
            deliveryAddressInput.value = address;
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification("Your cart is empty!");
            return;
        }

        if (deliveryCheckbox.checked && deliveryAddressInput.value.trim() === '') {
            showNotification("Please enter your delivery address.");
            return;
        }
        
        const isDelivery = deliveryCheckbox.checked;
        const successMessage = isDelivery 
            ? "Payment Successful, Your Order is on the way"
            : "Payment Complete";
        
        showNotification(successMessage);
        
        console.log("Checkout complete. Cart:", cart);
        cart = [];
        deliveryCheckbox.checked = false;
        deliveryAddressContainer.classList.add('hidden-delivery-address');
        deliveryAddressInput.value = '';
        updateCartUI();
        setTimeout(() => {
             cartSidebar.classList.remove('open');
        }, 800);
    });
}

export { initCart };