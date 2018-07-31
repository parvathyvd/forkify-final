import axios from 'axios';
import {key, proxy} from '../config'

class Recipe{
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try{
        const result = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`)
        this.title = result.data.recipe.title;
        this.author = result.data.recipe.publisher;
        this.img = result.data.recipe.image_url;
        this.url = result.data.recipe.source_url;
        this.ingredients = result.data.recipe.ingredients;
        }
        catch(error){
            alert('something went wrong in getting recipe..');
        }
    }
    calcTime() {
        const numIngre = this.ingredients.length;
        const periods = Math.ceil(numIngre/3);
        this.time = periods * 15
        
    }
    calcServings() {
        this.servings = 4;
    }
    //Parse the ingredients

    parseIngredients() {
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];


        const newIngredients = this.ingredients.map(el=> {
            // Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit,unitShort[i]);
            })

            //Remove parenthesis

            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // Parse ingredinets into count, unit and ingredient

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //there is a unit
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length ===1){
                    count = Math.ceil(eval(arrIng[0].replace('-','+')));
                }
                else{
                    count = Math.ceil(eval(arrIng.slice(0,unitIndex).join('+')));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            }
            else if (parseInt(arrIng[0],10)){
                // there is no unit but  a number

                objIng = {
                    count: Math.ceil(parseInt(arrIng[0],10)),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1){
                //there is  no unit and no number in this position

                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }

            }

            return objIng;

        })
        this.ingredients = newIngredients;

    }
    updateServings(type){
        const newServings  = (type === 'dec') ? this.servings -1 : this.servings +1;

        //ingredients
        this.ingredients.forEach(ing =>{
            ing.count *= newServings/this.servings
        });
        
        this.servings = newServings;

    }

}
   

export default Recipe;
