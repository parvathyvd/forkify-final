import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';







/****global state of the app ****/

const state = {}

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        try {

            // 3)Prepare the UI for results
            searchView.clearInput();
            searchView.clearResult();
            renderLoader(elements.recipeResults);

             
            // 4) Search for recipes
            await state.search.getResults();
            clearLoader();

        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
                    // 5) Render results on UI

       searchView.renderRecipies(state.search.result);
    }

}
elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResult();
        searchView.renderRecipies(state.search.result,goToPage);
    }
})



// Get ONE RECIPE

const controlRecipe = async () =>{
    
    const hashid = window.location.hash;
    const id = hashid.replace('#','');
    //console.log(id);

    if(id){
        
        //Prepare UI for results

        recipeView.clearRecipe();

        renderLoader(elements.recipe);

        state.recipe = new Recipe(id);

        if(state.search){
            searchView.highlightRecipe(id); 

        }

        
        // get the recipe and parse the ingredients
        try{

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //calc servings and time

        state.recipe.calcTime();
        state.recipe.calcServings();

        //printing it to the dom

        clearLoader();
        recipeView.renderRecipe(state.recipe, state.like.isLiked(id)); 

        //clearrecipe

        }
        catch(error){
            alert(`${error} Error processing the recipe `);
        }

    }
}

window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load',controlRecipe);



const controlList = () =>{

    // Create a list if there is none
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItems(item);

        
    });

}

//Handling delete and update events
elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete button

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state and UI

        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

    }
    else if(e.target.matches('.shopping__count--value')){

        const value = parseFloat(e.target.value);
        state.list.updateItem(id, value);
    }
})

window.addEventListener('load', ()=>{
state.like = new Like();
likeView.toggleLikeMenu(state.like.getNumLikes())
});



const controlLike = () =>{
    //Add if not a like already there

    if(!state.like) state.like = new Like();
    const curretnID = state.recipe.id;

    //user not liked current recipe
    if(!state.like.isLiked(curretnID))
    {
        //Add like

        const newLike = state.like.addLike(
            curretnID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
            
        );
        //toggle
        likeView.toggleLikeBtn(true);


        //Add to UI

        likeView.renderLike(newLike);
    }
        //user liked current recipe
    else{
        //Remove like

        state.like.deleteLike(curretnID);

        //toggle

        likeView.toggleLikeBtn(false);


        //Remove Like UI

        likeView.deleteLike(curretnID);



    }
    likeView.toggleLikeMenu(state.like.getNumLikes());

}



//Handling the recipe inc/button clicks

elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1){
        //dec button is clicked
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
}
        else if(e.target.matches('.btn-increase, .btn-increase *')){
            //inc button is clicked
            state.recipe.updateServings('inc');
            recipeView.updateServingsIngredients(state.recipe);

    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
})






