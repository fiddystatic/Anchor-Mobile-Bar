const menuData = [
    {
        title: "Spirits & Liqueurs",
        image: "menu-spirits.png",
        alt: "Spirits and Liqueurs",
        items: [
            { name: "Vodka", price: "25.00" },
            { name: "Gin", price: "28.00" },
            { name: "Rum", price: "22.00" },
            { name: "Tequila", price: "30.00" },
            { name: "Whiskey", price: "35.00" },
        ]
    },
    {
        title: "Beer, Wine & Cider",
        image: "menu-beer-wine.png",
        alt: "Beer, Wine & Cider",
        items: [
            { name: "Craft Beer", price: "8.00" },
            { name: "Red Wine", price: "18.00" },
            { name: "Artisanal Cider", price: "9.00" },
        ]
    },
    {
        title: "Mixers & Soft Drinks",
        image: "menu-mixers.png",
        alt: "Mixers & Soft Drinks",
        items: [
            { name: "Sodas", price: "2.50" },
            { name: "Premium Juices", price: "4.00" },
            { name: "Tonic Water", price: "3.00" },
        ]
    },
    {
        title: "Gourmet Snacks",
        image: "menu-snacks.png",
        alt: "Gourmet Snacks",
        items: [
            { name: "Biltong & Dry Wors", price: "12.00" },
            { name: "Artisanal Chips", price: "6.00" },
            { name: "Gourmet Gummies", price: "7.00" },
        ]
    },
    {
        title: "Tobacco & Alternatives",
        image: "menu-tobacco.png",
        alt: "Tobacco & Alternatives",
        items: [
            { name: "Premium Cigars", price: "15.00" },
            { name: "Vapes & E-Liquids", price: "20.00" },
            { name: "Nicotine Pouches", price: "8.00" },
        ]
    },
    {
        title: "Bar Essentials",
        image: "menu-essentials.png",
        alt: "Bar Essentials",
        items: [
            { name: "Ice (Bag)", price: "5.00" },
            { name: "Quality Glassware", price: "10.00" },
            { name: "Garnishes", price: "5.00" },
        ]
    }
];

function createMenuItem(item) {
    return `
        <li data-item="${item.name}" data-price="${item.price}">
            <span class="menu-item-name">${item.name}</span>
            <div class="menu-item-action">
                <span class="menu-item-price">$${parseFloat(item.price).toFixed(2)}</span>
                <button class="add-to-cart-btn">+</button>
            </div>
        </li>
    `;
}

function createMenuCard(category) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
        <img src="${category.image}" alt="${category.alt}" class="menu-card-image">
        <div class="menu-card-content">
            <h3 class="menu-card-title">${category.title}</h3>
            <ul class="menu-card-list">
                ${category.items.map(createMenuItem).join('')}
            </ul>
        </div>
    `;
    return card;
}

function initMenu() {
    const menuGrid = document.querySelector('.grid');
    if (!menuGrid) return;

    menuData.forEach(category => {
        const card = createMenuCard(category);
        menuGrid.appendChild(card);
    });
}

export { initMenu };