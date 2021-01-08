$(function () {
    function getUrlParameters() {
        var queryObj = {};

        if (location.search.length > 0) {
            location.search.substr(1).split("&").forEach(function (item) {
                queryObj[item.split("=")[0].toLowerCase()] = item.split("=")[1];
            });
        }

        return queryObj;
    }

    function renderTopNav(queryObj) {
        var brand = document.querySelector(".navbar-brand");
        var cart = document.getElementById("cart");
        var signIn = document.getElementById("sign-in");
        var customerDropdown = document.getElementById("customer-dropdown");
        var adminDropdown = document.getElementById("admin-dropdown");

        if (brand && cart && signIn && customerDropdown && adminDropdown) {
            brand.href = "index.html";
            cart.style.display = "none";
            signIn.style.display = "none";
            customerDropdown.style.display = "none";
            adminDropdown.style.display = "none";

            if (queryObj.role === "customer") {
                brand.href += "?role=" + queryObj.role;
                cart.style.display = "block";
                cart.firstElementChild.href = "cart.html?role=customer";
                customerDropdown.style.display = "block";
            }
            else if (queryObj.role === "admin") {
                brand.href += "?role=" + queryObj.role;
                adminDropdown.style.display = "block";
            }
            else {
                cart.style.display = "block";
                cart.firstElementChild.href = "cart.html";
                signIn.style.display = "block";
            }
        }
    }

    function renderFooter() {
        var footerDate = document.getElementById("footerDate");

        if (footerDate) {
            footerDate.textContent = new Date().getFullYear();
        }
    }

    function renderBreadcrumb(addr, queryObj) {
        var breadcrumbLink = document.getElementById("breadcrumb-link");

        if (breadcrumbLink) {
            breadcrumbLink.href = addr;
            breadcrumbLink.href += queryObj.role ? "?role=" + queryObj.role : "";
        }
    }

    function renderCheckout(queryObj) {
        var checkoutTabs = document.getElementById("checkout-tabs");

        // show tabs if accessed via checkout process
        if (checkoutTabs) {
            checkoutTabs.style.display = "none";
            var nextEl = checkoutTabs.nextElementSibling.firstElementChild;
            nextEl.classList.add("mt-5")

            if (queryObj.checkout === "true") {
                checkoutTabs.style.display = "block";
                nextEl.classList.remove("mt-5");
            }
        }
    }

    function renderProducts(queryObj) {
        var card = document.querySelector(".card");
        var carouselImage = document.querySelector(".carousel-image");
        var addr = "product.html";
        addr += queryObj.role ? "?role=" + queryObj.role : "";

        if (card) {
            card.addEventListener("click", function () {
                location.href = addr;
            });
        }

        if (carouselImage) {
            carouselImage.addEventListener("click", function () {
                location.href = addr;
            });
        }
    }

    function renderProduct(queryObj) {
        var customerOnly = Array.prototype.slice.call(document.querySelectorAll(".customer-only"));

        renderBreadcrumb("index.html", queryObj);

        customerOnly.forEach(function (c) {
            c.style.display = "block";

            if (queryObj.role === "admin") {
                c.style.display = "none";
            }
        });
    }

    function renderProductForm(queryObj) {
        var productCrumb = document.querySelector(".breadcrumb-item.active");
        var productTitle = document.querySelector("h1");
        var productImage = document.querySelector(".custom-file-img");
        var productButton = document.getElementById("btnSubmit");
        var productInput = Array.prototype.slice.call(document.querySelectorAll(".card-form input, .card-form textarea"));
        var isAdd = queryObj.mode === "add";

        document.title = "Edit Product";

        if (productCrumb) {
            productCrumb.textContent = isAdd ? "Add" : "Edit";
        }

        if (productTitle) {
            productTitle.textContent = isAdd ? "ADD PRODUCT" : "EDIT PRODUCT";
        }

        if (productImage) {
            productImage.style.display = isAdd ? "none" : "block";
        }

        if (productButton) {
            productButton.textContent = isAdd ? "ADD" : "UPDATE";
        }

        if (isAdd) {
            productInput.forEach(function (p) {
                if (p.type === "text") {
                    p.value = "";
                }
                else {
                    p.textContent = "";
                }
            });

            document.title = "Add Product";
        }
    }

    function renderOrders(queryObj) {
        var adminOnly = Array.prototype.slice.call(document.querySelectorAll(".admin-only"));
        var tableLink = Array.prototype.slice.call(document.querySelectorAll(".table-link"));

        adminOnly.forEach(function (a) {
            a.style.display = queryObj.role === "admin" ? "block" : "none";
        });

        if (queryObj.role) {
            tableLink.forEach(function (t) {
                t.href = "order.html?role=" + queryObj.role + "&checkout=false&ref=orders&order=5F721AF77829920004C89E0C&pay=9/28/2020_5:19pm&deliver=";
            });
        }
    }

    function renderOrder(queryObj) {
        var orderBreadcrumb = document.getElementById("order-breadcrumb");
        var orderId = document.getElementById("order-id");
        var statusDeliver = document.getElementById("status-deliver");
        var statusPay = document.getElementById("status-pay");
        var orderButton = document.getElementById("order-button");

        // show breadcrumb if page accessed from orders dashboard
        if (orderBreadcrumb) {
            orderBreadcrumb.style.display = "none";

            if (queryObj.ref === "orders") {
                orderBreadcrumb.style.display = "block";
            }

            renderBreadcrumb("orders.html", queryObj);
        }

        renderCheckout(queryObj);

        // show order number if order placed
        if (orderId) {
            if (queryObj.order) {
                orderId.innerHTML = "<h1>ORDER " + queryObj.order + "</h1>";
                orderId.classList.add("mt-5");
                orderId.classList.add("mb-3");
            }
        }

        // show delivery status if order placed
        if (statusDeliver) {
            statusDeliver.style.display = "none";

            if (queryObj.order) {
                if (queryObj.deliver) {
                    var deliver_date = queryObj.deliver.split("_")[0];
                    var deliver_time = queryObj.deliver.split("_")[1];
                    statusDeliver.style.display = "block";
                    statusDeliver.innerHTML = "Delivered on " + deliver_date + " at " + deliver_time;
                    statusDeliver.className = "w-100 alert alert-success mt-2";
                }
                else {
                    statusDeliver.style.display = "block";
                    statusDeliver.innerHTML = "Not delivered";
                    statusDeliver.className = "w-100 alert alert-danger mt-2";
                }
            }
        }

        // show payment status if order placed
        if (statusPay) {
            statusPay.style.display = "none";

            if (queryObj.order) {
                if (queryObj.pay) {
                    var pay_date = queryObj.pay.split("_")[0];
                    var pay_time = queryObj.pay.split("_")[1];
                    statusPay.style.display = "block";
                    statusPay.innerHTML = "Paid on " + pay_date + " at " + pay_time;
                    statusPay.className = "w-100 alert alert-success mt-2";
                }
                else {
                    statusPay.style.display = "block";
                    statusPay.innerHTML = "Not paid";
                    statusPay.className = "w-100 alert alert-danger mt-2";
                }
            }
        }

        // show order button for following conditions:
        //   customer role, order not placed
        //   customer role, order placed, not paid
        //   admin role, order placed, paid, not delivered
        if (orderButton) {
            var div = document.createElement("div");
            var btn = orderButton.firstElementChild;

            div.className = "divider";
            orderButton.style.display = "none";

            if (queryObj.role === "customer") {
                if (!queryObj.order) {
                    orderButton.insertAdjacentElement("beforebegin", div);
                    orderButton.style.display = "block";
                    btn.className = "btn btn-dark btn-block";
                    btn.innerHTML = "PLACE ORDER";
                    btn.setAttribute("data-action", "role=customer&checkout=false&ref=&order=5F721AF77829920004C89E0C&deliver=&pay=");
                }
                else if (!queryObj.pay) {
                    orderButton.insertAdjacentElement("beforebegin", div);
                    orderButton.style.display = "block";
                    btn.className = "btn btn-paypal btn-block";
                    btn.innerHTML = "&nbsp;";
                    btn.setAttribute("data-action", "role=customer&checkout=false&ref=&order=5F721AF77829920004C89E0C&pay=9/28/2020_5:19pm&deliver=");
                }
            }

            if (queryObj.role === "admin") {
                if (queryObj.pay && !queryObj.deliver) {
                    orderButton.insertAdjacentElement("beforebegin", div);
                    orderButton.style.display = "block";
                    btn.className = "btn btn-dark btn-block";
                    btn.innerHTML = "MARK AS DELIVERED";
                    btn.setAttribute("data-action", "role=admin&checkout=false&ref=orders&order=5F721AF77829920004C89E0C&pay=9/28/2020_5:19pm&deliver=09/28/2020_5:30pm");
                }
            }
        }
    }

    function signIn(queryObj) {
        var email = document.getElementById("email");

        if (email.value === "customer") {
            if (queryObj.checkout === "true") {
                location.href = "shipping.html?role=customer&checkout=true";
            }
            else {
                location.href = "index.html?role=customer";
            }
        }
        else if (email.value === "admin") {
            location.href = "index.html?role=admin";
        }
    }

    function startCheckout(queryObj) {
        if (queryObj.role) {
            location.href = "shipping.html?role=customer&checkout=true";
        }
        else {
            location.href = "sign_in.html?checkout=true";
        }
    }

    function continueCheckout(btn) {
        var form = btn.parentElement.parentElement;
        location.href = form.action;
    }

    function processOrder(btn) {
        location.href = "order.html?" + btn.getAttribute("data-action");
    }

    function searchProducts(queryObj) {
        addr = "search.html";
        addr += queryObj.role ? "?role=" + queryObj.role : "";
        location.href = addr;
    }

    function renderModal(el, e) {
        e.preventDefault();

        $(el).modal("show");
    }

    var queryObj = getUrlParameters();
    var btnSignIn = document.getElementById("btnSignIn");
    var btnContinue = document.getElementById("btnContinue");
    var btnOrder = document.getElementById("btnOrder");
    var btnCheckout = document.getElementById("btnCheckout");
    var btnSearch = document.getElementById("btnSearch");
    var delProductLink = document.getElementById("delProductLink");
    var delItemLink = document.getElementById("delItemLink");

    renderTopNav(queryObj);
    renderFooter();

    if (location.pathname.includes("index.html")) {
        renderProducts(queryObj);
    }

    if (location.pathname.includes("product.html")) {
        renderProduct(queryObj);
    }

    if (location.pathname.includes("form_product.html")) {
        renderProductForm(queryObj);
    }

    if (location.pathname.includes("order.html")) {
        renderOrder(queryObj);
    }

    if (location.pathname.includes("orders.html")) {
        renderOrders(queryObj);
    }

    if (location.pathname.includes("sign_in.html")) {
        renderCheckout(queryObj);
    }

    if (location.pathname.includes("search.html")) {
        renderBreadcrumb("index.html", queryObj);
    }

    if (btnSignIn) {
        btnSignIn.addEventListener("click", signIn.bind(this, queryObj));
    }

    if (btnContinue) {
        btnContinue.addEventListener("click", continueCheckout.bind(this, btnContinue));
    }

    if (btnOrder) {
        btnOrder.addEventListener("click", processOrder.bind(this, btnOrder));
    }

    if (btnCheckout) {
        btnCheckout.addEventListener("click", startCheckout.bind(this, queryObj));
    }

    if (btnSearch) {
        btnSearch.addEventListener("click", searchProducts.bind(this, queryObj));
    }

    if (delProductLink) {
        delProductLink.addEventListener("click", renderModal.bind(this, delProductModal));
    }

    if (delItemLink) {
        delItemLink.addEventListener("click", renderModal.bind(this, delItemModal));
    }

    $('[data-toggle="tooltip"]').tooltip();
});