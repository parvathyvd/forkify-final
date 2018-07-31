export const elements = {
    resultsList : document.querySelector('.results__list'),
    searchInput : document.querySelector('.search__field'),
    searchForm : document.querySelector('.search'),
    recipeResults : document.querySelector('.results'),
    searchResPages : document.querySelector('.results__pages'),
    recipe : document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};


export const eleStrings = {
    loader : 'loader'
}

export const renderLoader = parent => {
    const loader = `
                <div class = "${eleStrings.loader}">
                <svg>
                <use href="img/icons.svg#icon-cw"></use>
                </svg>
                </div>
                    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}


export const clearLoader = () => {
   const loader = document.querySelector(`.${eleStrings.loader}`);
        if(loader){
            loader.parentElement.removeChild(loader);
        }
}