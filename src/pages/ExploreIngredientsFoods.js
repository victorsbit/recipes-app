import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import GlobalContext from '../context/GlobalContext';
import './ExploreGeneric.css';

function ExploreIngsFoods() {
  const { setRenderMealsState, setExploreFood } = useContext(GlobalContext);
  const [ingredientesFoodState, setIngredientesFoodState] = useState([]);
  const history = useHistory();
  const DOZE = 12;

  useEffect(() => {
    const ingredientsMealF = async () => {
      const url = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';
      const data = await fetch(url).then((response) => response.json());
      const ingredientes = data.meals.slice(0, DOZE);
      setIngredientesFoodState(ingredientes);
    };
    ingredientsMealF();
  }, []);

  const ingredientsMeal = async (ingredients) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`;
    const { meals } = await fetch(url).then((response) => response.json());
    setRenderMealsState(meals.slice(0, DOZE));
  };

  const handleIngredient = async (ingredient) => {
    setExploreFood(true);
    await ingredientsMeal(ingredient);
    history.push('/foods');
  };

  return (
    <div>
      <Header title="Explore Ingredients Foods" showBt={ false } />
      <div className="exp-ing-foods">
        {ingredientesFoodState.map((ing, index) => (
          <button
            type="button"
            onClick={ () => handleIngredient(ing.strIngredient) }
            className="explore-ing-container"
            key={ ing.idIngredient }
            data-testid={ `${index}-ingredient-card` }
          >
            <img
              data-testid={ `${index}-card-img` }
              src={ `https://www.themealdb.com/images/ingredients/${ing.strIngredient}-Small.png` }
              alt={ ing.strIngredient }
            />
            <p data-testid={ `${index}-card-name` }>{ ing.strIngredient }</p>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ExploreIngsFoods;
