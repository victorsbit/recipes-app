import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import GlobalContext from '../contex/GlobalContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

export default function FoodInProgress() {
  const { verifyFavoriteRecipe, addRecipeToFavoriteList } = useContext(GlobalContext);
  const [recipe, setRecipe] = useState({});
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredientsDone, setIngredientsDone] = useState([]);
  const [measureList, setMeasureList] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ableBtn, setAbleBtn] = useState(true);
  const params = useParams();
  const { id } = params;
  const history = useHistory();

  useEffect(() => {
    const requestRecipe = async () => {
      const API_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      const result = await fetch(API_URL);
      const data = await result.json();

      setRecipe(data.meals[0]);
    };

    setIsFavorite(verifyFavoriteRecipe(id));
    requestRecipe();
  }, [verifyFavoriteRecipe, id]);

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

  useEffect(() => {
    const inProgressRecipes = JSON
      .parse(localStorage.getItem('inProgressRecipes') || '{}');

    if (inProgressRecipes.meals === undefined) {
      const obj = {
        cocktails: {},
        meals: {
          [id]: [],
        },
      };

      localStorage.setItem('inProgressRecipes', JSON.stringify(obj));
    } else {
      const { meals } = inProgressRecipes;
      setIngredientsDone([...meals[id]]);
    }
  }, [id]);

  useEffect(() => {
    const LENGTH = ingredientList.length;
    if (ingredientsDone.length === LENGTH) {
      setAbleBtn(false);
    } else {
      setAbleBtn(true);
    }
  }, [ingredientsDone, ingredientList]);

  const handleStorage = (name, isChecked) => {
    const inProgressRecipes = JSON
      .parse(localStorage.getItem('inProgressRecipes') || '{}');

    const { meals } = inProgressRecipes;
    let newIngredientList = [...meals[id]];
    if (isChecked && (!meals[id].some((ingredient) => ingredient === name))) {
      newIngredientList = [...meals[id], name];
      setIngredientsDone([...newIngredientList]);
    } else if (!isChecked && meals[id].some((ingredient) => ingredient === name)) {
      newIngredientList = meals[id].filter((ingredient) => ingredient !== name);
      setIngredientsDone([...newIngredientList]);
    }

    const newObjStorage = {
      cocktails: { ...inProgressRecipes.cocktails },
      meals: {
        ...inProgressRecipes.meals,
        [id]: newIngredientList,
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(newObjStorage));
  };

  const handleChecked = (ingredient) => ingredientsDone.some((ing) => ing === ingredient);

  return (
    <div>
      <div>
        <img src={ recipe.strMealThumb } alt="#" data-testid="recipe-photo" />
        <h1 data-testid="recipe-title">{ recipe.strMeal }</h1>
      </div>
      <div>
        <button
          type="button"
          data-testid="share-btn"
          onClick={ () => {
            navigator.clipboard.writeText(`http://localhost:3000/foods/${id}`);
            setLinkCopied(true);
          } }
        >
          {linkCopied && <span>Link copied!</span>}
          <img src={ shareIcon } alt="#" />
        </button>
        {isFavorite && (
          <button
            type="button"
            data-testid="favorite-btn"
            src={ blackHeartIcon }
            onClick={ () => {
              setIsFavorite(!isFavorite);
            } }
          >
            <img src={ blackHeartIcon } alt="#" />
          </button>
        )}
        {!isFavorite && (
          <button
            type="button"
            data-testid="favorite-btn"
            src={ whiteHeartIcon }
            onClick={ () => {
              setIsFavorite(!isFavorite);
              addRecipeToFavoriteList(recipe, 'food');
            } }
          >
            <img src={ whiteHeartIcon } alt="#" />
          </button>
        )}
      </div>
      <div>
        <h2 data-testid="recipe-category">
          { recipe.strCategory }
        </h2>
      </div>
      <h2>Ingredients</h2>
      <ul>
        {ingredientList.map((ingredient, index) => (
          <li
            key={ `${index}-${ingredient}` }
            data-testid={ `${index}-ingredient-step` }
          >
            <label htmlFor={ index }>
              <input
                type="checkbox"
                id={ index }
                checked={ handleChecked(ingredient) }
                name={ ingredient }
                onChange={ ({ target }) => handleStorage(target.name, target.checked) }
              />
              {`${ingredient} - ${measureList[index]}`}
            </label>
          </li>
        ))}
      </ul>
      <div>
        <h2>Instructions</h2>
        <p data-testid="instructions">{recipe.strInstructions}</p>
        <button
          type="button"
          data-testid="finish-recipe-btn"
          disabled={ ableBtn }
          onClick={ () => history.push('/done-recipes') }
        >
          Finish recipe
        </button>
      </div>
    </div>
  );
}
