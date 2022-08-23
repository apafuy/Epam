import './styles.css';
import products from './data';

const table = document.querySelector('.table');
const search = document.querySelector('#search');
const add = document.querySelector('#add');
const nameOption = document.querySelector('#nameOption');
const countOption = document.querySelector('#countOption');
const priceOption = document.querySelector('#priceOption');
let currentProducts = [];

const priceCorrect = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const createRow = ({name, count, price}) => {
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `<div class="name nameItem">
                        <p class="text productName">${name}</p>
                        <div class="circle" id="circle"><p class="text productCount">${count}</p></div>
                    </div>
                    <div class="price">
                        <p class="columnName text">$${priceCorrect(price)}</p>
                    </div>
                    <div class="actions">
                        <button class="text operation" data-name="${name}" data-count="${count}" data-price="$${priceCorrect(price)}" id="edit">Edit</button>
                        <button class="text operation" data-name="${name}" id="delete">Delete</button>
                    </div>`;
    const circle = div.querySelector('#circle');
    circle.style.width = `${count.toString().length * 20}px`;
    circle.style.height = `${count.toString().length * 20}px`;
    circle.style.borderRadius = `${count.toString().length * 20 / 2}px`;

    table.append(div);
}

const tableClear = () => {
    const rows = table.querySelectorAll('.row');
    Array.from(rows).forEach((item) => {
        if(rows[0] !== item) {
            item.remove();
        }
    })
}


products.forEach(item => {
    createRow(item);
    currentProducts.push(item);
})
table.addEventListener('click', (event) => {
    if (event.target.id === 'btnSortName') {
        tableClear();
        if (!event.target.classList.contains('triangleDown')) {
            currentProducts.sort((a, b) => a.name > b.name ? -1 : 1);
        } else {
            currentProducts.sort((a, b) => a.name > b.name ? 1 : -1);
        }
        event.target.classList.toggle('triangleDown');
        currentProducts.forEach(item => createRow(item));
    } else if (event.target.id === 'btnSortPrice') {
        tableClear();
        if (!event.target.classList.contains('triangleDown')) {
            currentProducts.sort((a, b) => a.price > b.price ? 1 : -1);
        } else {
            currentProducts.sort((a, b) => a.price > b.price ? -1 : 1);
        }
        event.target.classList.toggle('triangleDown');
        currentProducts.forEach(item => createRow(item));
    } else if (event.target.id === 'delete') {
        const modalWrapper = document.querySelector('#modalWrapper');
        const modal = document.querySelector('#modal');
        modalWrapper.classList.remove('hidden');
        modalWrapper.classList.add('modalWrapper');
        modal.addEventListener('click', (e) => {
            if (e.target.textContent === 'Да') {
                modalWrapper.classList.remove('modalWrapper');
                modalWrapper.classList.add('hidden');
                const currentProductsNew = currentProducts.filter((item) => {
                    if (item.name === event.target.dataset.name) {
                        return false;
                    }
                    return true;
                })
                tableClear();
                currentProductsNew.forEach((item) => {
                    createRow(item);
                })
                currentProducts = Array.from(currentProductsNew);
            } else if (e.target.textContent === 'Нет') {
                modalWrapper.classList.remove('modalWrapper');
                modalWrapper.classList.add('hidden');
            }
        })
    } else if (event.target.id === 'edit') {
        add.textContent = 'Update';
        nameOption.value = event.target.dataset.name;
        nameOption.setAttribute('data-name', event.target.dataset.name);
        countOption.value = event.target.dataset.count;
        priceOption.value = event.target.dataset.price;
    }

})

search.addEventListener('click', () => {
    const input = document.querySelector('#inputSearch').value.toLowerCase().trim();
    if(input === '') {
        tableClear();
        currentProducts = [];
        products.forEach(item => {
            createRow(item);
            currentProducts.push(item);
        })
    } else if(input.length) {
        tableClear();
        currentProducts = products.filter((item) => {
            if(item.name.toLowerCase().includes(input)) {
                return 1;
            }
            return 0;
        });
        currentProducts.forEach(item => createRow(item));
    }

})



countOption.addEventListener('input', (event) => {
    const { target } = event;
    target.value = target.value.replace(/[^0-9]/g, '');
});
priceOption.addEventListener('input', (event) => {
    const { target } = event;
    target.value = target.value.replace(/[^0-9,]/g, '');

});
countOption.addEventListener('change', (event) => {
    const { target } = event;
    let text = target.value;
    while (text[0] === '0') text = text.substring(1, text.length);
    target.value = text;
})
priceOption.addEventListener('blur', (event) => {
    const { target } = event;
    if (target.value) {
        let text = target.value;
        while(text[0] === '0' || text[0] === '$') text = text.substring(1, text.length);
        text = text.replace(/[^0-9]/g, '');
        target.value = `$${priceCorrect(text)}`;
    }
});

priceOption.addEventListener('focus', () => {
    if (priceOption.value[0] === '$') priceOption.value = priceOption.value.substring(1, priceOption.length);
})

add.addEventListener('click', () => {
    const name = nameOption.value.trim();
    const count = countOption.value;
    const price = priceOption.value;
    const spanName = document.querySelector('#nameError');
    const spanCount = document.querySelector('#countError');
    const spanPrice = document.querySelector('#priceError');
    spanName.classList.add('hidden');
    spanCount.classList.add('hidden');
    spanPrice.classList.add('hidden');
    let correct = true;
    if (add.textContent !== 'Update') {
        products.forEach((item) => {
          if (item.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
            spanName.textContent = 'Товар с таким именем уже есть';
            spanName.classList.remove('hidden');
            correct = false;
          }
        });
    }

    if (name.length === 0 || name.length > 15) {
        spanName.textContent = 'Поле заполнено не верно!';
        spanName.classList.remove('hidden');
        correct = false;
    }
    if (!count) {
        spanCount.classList.remove('hidden');
        correct = false;
    }
    if (!price) {
        spanPrice.classList.remove('hidden');
        correct = false;
    }

    if (correct && add.textContent === 'Add') {
        products.push({
          name,
          count: Number(count),
          price: Number(price.replace(/[^0-9]/g, '')),
        });
        currentProducts.push(products[products.length - 1]);
        createRow(products[products.length - 1]);
    } else if (correct && add.textContent === 'Update') {
        const finding = (item) => {
            if (item.name === nameOption.dataset.name) {
                return true;
            }
            return false;
        }
        const indexProducts = products.findIndex(finding);
        const indexCurrentProducts = currentProducts.findIndex(finding);
        products[indexProducts].name = name;
        products[indexProducts].count = Number(count);
        products[indexProducts].price = Number(price.replace(/[^0-9]/g, ''));

        currentProducts[indexCurrentProducts].name = name;
        currentProducts[indexCurrentProducts].count = Number(count);
        currentProducts[indexCurrentProducts].price = Number(price.replace(/[^0-9]/g, ''));
        tableClear();
        currentProducts.forEach((item) => {
            createRow(item);
        })
        add.textContent = 'Add';
        spanName.classList.add('hidden');
        spanCount.classList.add('hidden');
        spanPrice.classList.add('hidden');
    }
})