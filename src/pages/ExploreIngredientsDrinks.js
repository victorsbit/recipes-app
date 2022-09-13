import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import GlobalContext from '../context/GlobalContext';
import './ExploreGeneric.css';

function ExploreIngsDrinks() {
  const { setRenderDrinksState, setExploreDrink } = useContext(GlobalContext);
  const [ingredientesDrinkState, setIngredientesDrinkState] = useState([]);
  const history = useHistory();
  const DOZE = 12;

  useEffect(() => {
    const ingredientsDrinks = async () => {
      const url = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list';
      const data = await fetch(url).then((response) => response.json());
      const ingredientes = data.drinks.slice(0, DOZE);
      setIngredientesDrinkState(ingredientes);
    };
    ingredientsDrinks();
  }, []);

  const feathDrink = async (ingredient) => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    const { drinks } = await fetch(url).then((response) => response.json());
    setRenderDrinksState(drinks.slice(0, DOZE));
  };

  const handleIngredient = async (ingredient) => {
    setExploreDrink(true);
    await feathDrink(ingredient);
    history.push('/drinks');
  };

  return (
    <div>
      <Header title="Explore Ingredients Drinks" showBt={ false } />
      <div className="exp-ing-foods">
        {ingredientesDrinkState.map((ing, index) => (
          <button
            type="button"
            onClick={ () => handleIngredient(ing.strIngredient1) }
            className="explore-ing-container"
            key={ index }
            data-testid={ `${index}-ingredient-card` }
          >
            <img
              data-testid={ `${index}-card-img` }
              src={ `https://www.thecocktaildb.com/images/ingredients/${ing.strIngredient1}-Small.png` }
              alt={ ing.strIngredient1 }
            />
            <p data-testid={ `${index}-card-name` }>{ing.strIngredient1}</p>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default ExploreIngsDrinks;
