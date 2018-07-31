import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {elements.searchInput.value = '';}

export const clearResult = () => {
    elements.resultsList.innerHTML = ''
    elements.searchResPages.innerHTML = ''
}


const reduceTitle = (title, limit=17) =>{
    if(title.length>limit){
        const newTitile = [];
        title.split(' ').reduce((acc, cur) => {
            if(acc+cur.length <= limit){
                newTitile.push(cur);
            }
            return acc + cur.length
        },0);
        return `${newTitile.join(" ")}...`;
    }
    return title;

}


const renderRecipe = receipe =>{
    const markup = `<li>
    <a class="results__link" href="#${receipe.recipe_id}">
    <figure class="results__fig">
            <img src="${receipe.image_url}" alt="${receipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${reduceTitle(receipe.title)}</h4>
            <p class="results__author">${receipe.publisher}</p>
        </div>
    </a>
    </li>`;
    elements.resultsList.insertAdjacentHTML('beforeend',markup);
}

const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1 : page+1 }>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left' : 'right' }"></use>
        </svg>
        <span>Page ${type==='prev'? page-1 : page+1 }</span>
        </button>`;


const renderButtons = (page, numResults, resPerpage) => {
    const pages = numResults/resPerpage;
    let button;
    if(page === 1 && pages>1){
        //go to the next
       button = createButton(page,'next')
    }
    else if(page<pages){
        //go to the next,prev
        button = `${createButton(page,'next')}
                 ${createButton(page,'prev')}`;

    }
    else if(page===pages && pages>1){
        //go to the prev
        button = createButton(page,'prev')

    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}



export const renderRecipies =   (recipes, page =1, resPerPage =10) => {
    //render results of current page
    const start = (page-1) * resPerPage;
    const end = page *resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render buttons
    renderButtons(page,recipes.length, resPerPage);
}

export const highlightRecipe = id => {

    const resultsLink = document.querySelectorAll('.results__link')

    Array.from(resultsLink).forEach(el => el.classList.remove('results__link--active'))

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

