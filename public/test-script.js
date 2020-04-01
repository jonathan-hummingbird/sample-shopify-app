console.log("COMING FROM SCRIPT TAG API!");

/*
const makeHeader = message => {
    // const header  = $('header.site-header').parent();
    const header = document.querySelector('header.site-header').parentElement;
    //https://stackoverflow.com/questions/3391576/how-can-i-implement-prepend-and-append-with-regular-javascript
    const child = document.createElement("div");
    child.innerText = message;
    child.style.backgroundColor = "orange";
    child.style.textAlign = "center";
    header.insertBefore(child, header.firstChild);
};
*/

const makeApp = products => {
    const body = document.querySelector('body');
    body.style.position = "relative";

    const shop = Shopify.shop;
    const bestSellerContainer =  document.createElement('div');
    bestSellerContainer.innerHTML = "<h3>Our Best Sellers</h3>";
    bestSellerContainer.style.position = "fixed";
    bestSellerContainer.style.backgroundColor = "#ffffff";
    bestSellerContainer.style.border = "1px solid black";
    bestSellerContainer.style.bottom = "80px";
    bestSellerContainer.style.right = "25px";
    bestSellerContainer.style.width = "350px";
    bestSellerContainer.style.height = "400px";
    bestSellerContainer.style.display = "none";
    bestSellerContainer.style.padding = "10px";
    bestSellerContainer.style.overflowY = "scroll";

    products.map(item => {
        const element = document.createElement("a");
        element.setAttribute("href", `/products/${item.handle}`);
        element.style.display = "flex";
        element.style.alignItems = "center";
        element.style.padding = "20px 10px";
        element.style.borderTop = "1px solid black";

        const childImageElement = document.createElement("img");
        childImageElement.setAttribute("src", item.images[0].originalSrc);
        childImageElement.style.width = "75px";

        const childDivElement = document.createElement("div");
        childDivElement.style.display = "flex";
        childDivElement.style.justifyContent = "space-between";
        childDivElement.style.alignItems = "start";
        childDivElement.style.width = "100%";

        const childPTitleElement = document.createElement("p");
        childPTitleElement.innerText = item.title;
        childPTitleElement.style.padding = "0px 10px";
        childDivElement.appendChild(childPTitleElement);

        const childPPriceElement = document.createElement("p");
        childPPriceElement.innerText = "$" + item.variants[0].price;
        childDivElement.appendChild(childPPriceElement);

        element.appendChild(childImageElement);
        element.appendChild(childDivElement);
        bestSellerContainer.appendChild(element);
    });

    const bestSellerButton = document.createElement('img');
    bestSellerButton.setAttribute('src', "https://cdn.shopify.com/s/files/1/0325/3174/2765/files/bestseller-button-trans.png?v=1584741923");
    bestSellerButton.style.position = "fixed";
    bestSellerButton.style.width = "150px";
    bestSellerButton.style.bottom = "20px";
    bestSellerButton.style.right = "20px";
    bestSellerButton.style.cursor = "pointer";

    body.appendChild(bestSellerButton);
    body.appendChild(bestSellerContainer);

    bestSellerButton.onclick = () => {
        if (bestSellerContainer.style.display === 'block') {
            bestSellerContainer.style.display = 'none';
        } else {
            bestSellerContainer.style.display = 'block';
        }
    };
};



fetch("https://cors-anywhere.herokuapp.com/https://f7fc29ad.ngrok.io/api/products")
    .then(res => res.json())
    .then(data => {
        makeApp(data.data);
    })
    .catch(error => {
        console.log(error);
    })
;
