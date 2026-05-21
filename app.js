


const configState = {
    flavor: 'Original Milk',
    dustingLevel: 3,
    toppings: {
        sprinkles: false,
        cheese: false,
        caramel: false
    }
};


let shoppingBag = {
    itemsCount: 0,
    totalPrice: 0,
    itemsList: []
};


document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    setupMobileMenu();
    setupLabListeners();
});


function setupMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    
    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });


    document.querySelectorAll(".mobile-link").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.add("hidden");
        });
    });
}


function setupLabListeners() {
    const slider = document.getElementById("dustingSlider");
    if(slider) {
        slider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            configState.dustingLevel = val;
            updateDustingVisuals();
        });
    }
}


window.setBaseFlavor = function(name, hexColor, accentColor) {
    configState.flavor = name;
    

    document.querySelectorAll(".flavor-btn").forEach(btn => {
        btn.classList.remove("active", "border-royalBlue", "bg-blue-50/50");
        btn.classList.add("border-transparent", "bg-slate-50");
    });
    

    const activeBtn = Array.from(document.querySelectorAll(".flavor-btn")).find(btn => btn.textContent.trim().includes(name.split(' ')[1] || name));
    if (activeBtn) {
        activeBtn.classList.remove("border-transparent", "bg-slate-50");
        activeBtn.classList.add("active", "border-royalBlue", "bg-blue-50/50");
    }


    const vizDonut = document.getElementById("visualizerDonut");
    if (vizDonut) {
        vizDonut.style.borderColor = hexColor;
    }

    updateLabelText();
}


window.toggleTopping = function(toppingName) {
    configState.toppings[toppingName] = !configState.toppings[toppingName];
    

    const btn = document.getElementById(`btn-${toppingName}`);
    if (btn) {
        if (configState.toppings[toppingName]) {
            btn.classList.add("bg-royalBlue", "text-white", "border-royalBlue");
            btn.classList.remove("text-slate-600", "border-slate-200");
        } else {
            btn.classList.remove("bg-royalBlue", "text-white", "border-royalBlue");
            btn.classList.add("text-slate-600", "border-slate-200");
        }
    }


    const layer = document.getElementById(`${toppingName}Layer`);
    if (layer) {
        if (configState.toppings[toppingName]) {
            layer.classList.remove("hidden");
        } else {
            layer.classList.add("hidden");
        }
    }

    updateLabelText();
}


function updateDustingVisuals() {
    const levelText = document.getElementById("dustingLevelText");
    const dustLayer = document.getElementById("dustingLayer");
    
    if (configState.dustingLevel === 1) {
        levelText.textContent = "Light Sweet Dust";
        if (dustLayer) {
            dustLayer.style.opacity = "0.3";
            dustLayer.style.borderWidth = "50px";
        }
    } else if (configState.dustingLevel === 2) {
        levelText.textContent = "Classic Susu";
        if (dustLayer) {
            dustLayer.style.opacity = "0.65";
            dustLayer.style.borderWidth = "56px";
        }
    } else {
        levelText.textContent = "Extreme Snow";
        if (dustLayer) {
            dustLayer.style.opacity = "0.95";
            dustLayer.style.borderWidth = "62px";
        }
    }
}


function updateLabelText() {
    const title = document.getElementById("currentSelectionTitle");
    const addon = document.getElementById("addonText");
    
    if (title) {
        title.textContent = `${configState.flavor} Premium`;
    }

    if (addon) {
        const activeToppings = Object.keys(configState.toppings)
            .filter(key => configState.toppings[key])
            .map(t => t.charAt(0).toUpperCase() + t.slice(1));
        
        addon.textContent = activeToppings.length > 0 
            ? `With extra: ${activeToppings.join(', ')}` 
            : "No Extra Toppings Chosen";
    }
}


window.addToOrder = function(boxName, price) {
    shoppingBag.itemsCount += 1;
    shoppingBag.totalPrice += price;
    shoppingBag.itemsList.push(boxName);


    const bagSection = document.getElementById("orderBag");
    const bagTitle = document.getElementById("bagTitle");
    const bagTotal = document.getElementById("bagTotal");

    if (bagSection) {
        bagSection.classList.remove("hidden");
    }

    if (bagTitle) {
        bagTitle.textContent = `Selected: ${shoppingBag.itemsCount} Delicious Packs`;
    }

    if (bagTotal) {

        const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(shoppingBag.totalPrice);
        bagTotal.textContent = formatted.replace("IDR", "Rp");
    }
}


window.checkoutOrder = function() {
    const phone = "6281234567890"; // Target merchant number
    const listSummary = shoppingBag.itemsList.join(", ");
    const text = encodeURIComponent(`Hi CAAH'S DONUT! I would love to order fresh yummy Donut Susu:\n\n- ${listSummary}\n\nTotal Price: Rp ${shoppingBag.totalPrice.toLocaleString('id-ID')}\nPlease confirm delivery availability! Thank you.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}


window.handleSignup = function(event) {
    event.preventDefault();
    const successCard = document.getElementById("signupSuccess");
    if (successCard) {
        successCard.classList.remove("hidden");
    }
}


window.resetSignup = function() {
    const successCard = document.getElementById("signupSuccess");
    const form = document.getElementById("membershipForm");
    if (successCard) {
        successCard.classList.add("hidden");
    }
    if (form) {
        form.reset();
    }
}
