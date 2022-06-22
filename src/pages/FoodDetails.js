import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

export default function FoodDetails() {
  const params = useParams();
  const [recipe, setRecipe] = useState({});
  const [ingredientList, setIngredientList] = useState([]);
  const [measureList, setMeasureList] = useState([]);
  const [drinkList, setDrinkList] = useState([]);

  // recipe request
  useEffect(() => {
    const id = Object.values(params)[0];

    const requestRecipe = async () => {
      const API_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      const result = await fetch(API_URL);
      const data = await result.json();

      setRecipe(data.meals[0]);
    };

    requestRecipe();
  }, [params]);

  // provides state with all the info
  useEffect(() => {
    const ingredients = Object.entries(recipe);
    const newIngredientsList = [];
    const newMeasureList = [];

    ingredients.forEach((item) => {
      if (item[0].includes('strIngredient')
        && (typeof item[1]) === 'string' && item[1].length > 0) {
        newIngredientsList.push(item[1]);
      }
    });

    ingredients.forEach((item) => {
      if (item[0].includes('strMeasure')) {
        newMeasureList.push(item[1]);
      }
    });

    setMeasureList(newMeasureList);
    setIngredientList(newIngredientsList);
  }, [recipe]);

  // drink (recomendation) request
  useEffect(() => {
    const drinkRequest = async () => {
      const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
      const result = await fetch(API_URL);
      const data = await result.json();

      setDrinkList(data);
    };

    drinkRequest();
  }, []);

  return (
    <main>
      <img src={ recipe.strMealThumb } data-testid="recipe-photo" alt="#" />
      <div>
        <h1 data-testid="recipe-title">{recipe.strMeal}</h1>
        <button
          type="button"
          data-testid="share-btn"
        >
          <img src={ shareIcon } alt="#" />
        </button>
        <button
          type="button"
          data-testid="favorite-btn"
        >
          <img src={ whiteHeartIcon } alt="#" />
        </button>
        <br />
        <span data-testid="recipe-category">{`Category: ${recipe.strCategory}`}</span>
      </div>
      <div>
        <h2>Ingredients</h2>
        <ul>
          {ingredientList.map((ingredient, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {`${ingredient} - ${measureList[index]}`}
            </li>
          ))}
        </ul>
        <div>
          <h2>Instructions</h2>
          <span data-testid="instructions">
            {recipe.strInstructions}
          </span>
        </div>
        <div>
          <h2>Video</h2>
          <iframe
            data-testid="video"
            src={ recipe.strYoutube }
            title="video"
          />
        </div>
        <div>
          <h2>Recommended</h2>
          {ingredientList.map((ingredient, index) => (
            <span
              key={ index }
              data-testid={ `${index}-recomendation-card` }
            >
              {ingredient}
            </span>
          ))}
        </div>
        <div>
          <button type="button" data-testid="start-recipe-btn">
            Start Recipe
          </button>
        </div>
      </div>
    </main>
  );
}
