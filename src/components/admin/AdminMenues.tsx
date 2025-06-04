import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pizza } from '../../types/Pizza';
import { Topping } from '../../types/Topping';
import AdminPizzaCreateEdit from "./AdminPizzaCreateEdit"

interface AdminMenuesProps {
  isOpen: boolean;
  onClose: () => void;
}


const AdminMenues: React.FC = () => {
  const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;


  const [isCreateEditPizzaModalOpen, setIsCreateEditPizzaModalOpen] = useState(false);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [pizzaToEdit, setPizzaToEdit] = useState<Pizza | null>(null);

  const [isCreateEditToppingModalOpen, setIsCreateEditToppingModalOpen] = useState(false);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [toppingToEdit, setToppingToEdit] = useState<Topping | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let url: string = webApiBaseUrl + '/Home/pizzalist';
    axios.get<Pizza[]>(url)
      .then(response => {
        setPizzas(response.data);
      })
      .catch(err => {
        setError('Failed to load locations');
      });

    url = webApiBaseUrl + '/Home/toppinglist';
    axios.get<Topping[]>(url)
      .then(response => {
        setToppings(response.data);
      })
      .catch(err => {
        setError('Failed to load locations');
      });

  }, [isCreateEditPizzaModalOpen, submitting]);

  const handleNewPizza = () => {
    setPizzaToEdit(null);
    setIsCreateEditPizzaModalOpen(true);
  };

  const handleEditPizza = (pizza: Pizza) => {
    setPizzaToEdit(pizza);
    setIsCreateEditPizzaModalOpen(true);
  };

  const handleCloseCreateEditPizzaModal = () => {
    setIsCreateEditPizzaModalOpen(false);
  };

  const handleDeletePizza = (pizza: Pizza) => {
    if (pizza !== null) {
      const deletePizza = async () => {
        try {
          setSubmitting(true);
          const url = webApiBaseUrl + '/Admin/removepizza/' + pizza.id;
          await axios.delete(url);
        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };

      deletePizza();  // Call the inner async function
    }
  };

  const handleNewTopping = () => {
    setIsCreateEditToppingModalOpen(true);
  };

  const handleEditTopping = (topping: Topping) => {
    setToppingToEdit(topping);
    setIsCreateEditToppingModalOpen(true);
  };

  const handleDeleteTopping = (topping: Topping) => {
    if (topping !== null) {
      const deleteTopping = async () => {
        try {
          setSubmitting(true);
          const url = webApiBaseUrl + '/Admin/remocation/' + topping.id;
          await axios.delete(url);
        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };

      deleteTopping();  // Call the inner async function
    }
  };

  return (
    <div>
      <AdminPizzaCreateEdit
        isOpen={isCreateEditPizzaModalOpen}
        onClose={handleCloseCreateEditPizzaModal}
        pizzaToEdit={pizzaToEdit}
      />


      <div style={{
        border: '1px solid grey',
        padding: '10px', // optional: adds space inside the border
        borderRadius: '5px', // optional: rounded corners
        fontSize: '20px',
        color: '#22191b',
        fontWeight: 200,
        textAlign: 'center'

      }}>
        <div style={{ textAlign: 'center',  fontSize: '36px', }}>
          Menu
        </div>


        <div style={{ marginTop: '20px', textAlign: 'left', backgroundColor: 'cornsilk' }}>
          <div
            style={{
              border: '1px solid #ccc',    // Border around each row
              padding: '10px',             // Optional: Adds spacing inside each row
              marginBottom: '5px',         // Optional: Adds spacing between rows
              display: 'grid',
              fontWeight: 700,
              fontSize: 'px',
              gridTemplateColumns: '1fr 2fr 4fr 1fr 1fr 1fr 1fr 1fr', // Adjust column sizes as needed
              alignItems: 'center',
              marginBlockEnd: 30
            }}
          >
            <div>Pizza nr.</div>
            <div>Pizzanavn</div>
            <div>Beskrivelse</div>
            <div>Pris før rabat</div>
            <div>Rabat i %</div>
            <div>Pris efter rabat</div>
          </div>
          {pizzas.map((curPizza, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',    // Border around each row
                padding: '10px',             // Optional: Adds spacing inside each row
                marginBottom: '5px',         // Optional: Adds spacing between rows
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 4fr 1fr 1fr 1fr 1fr 1fr', // Adjust column sizes as needed
                alignItems: 'center'
              }}
            >
              <div>
                <div>{curPizza.pizzanumber}</div>
                <img
                  src={webApiBaseUrl + curPizza.imageurl}

                  style={{ maxWidth: '100px', height: 'auto', marginTop: '5px' }}
                />
              </div>
              <div>
                <div>{curPizza.name}</div>
              </div>

              {/* The rest of the columns remain unchanged */}
              <div>{curPizza.description}</div>
              <div>{curPizza.discountprice.toFixed(2).replaceAll('.', ',')}</div>
              <div>{curPizza.discountpercentage}</div>
              
              <div>{curPizza.price.toFixed(2).replaceAll('.', ',')}</div>
              <div>
                <button
                  onClick={() => handleEditPizza(curPizza)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Rediger
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleDeletePizza(curPizza)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              border: '1px solid #ccc',    // Border around each row
              padding: '10px',             // Optional: Adds spacing inside each row
              marginBottom: '5px',         // Optional: Adds spacing between rows
              display: 'grid',
              fontWeight: 700,
              fontSize: 'px',
              gridTemplateColumns: '1fr 2fr 4fr 1fr 1fr 1fr 1fr 1fr', // Adjust column sizes as needed
              alignItems: 'center',
              marginBlockEnd: 30
            }}
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div>
              <button
                onClick={handleNewPizza}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#8d4a5b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Ny
              </button>
            </div>
          </div>
        </div>


        <div style={{
          textAlign: 'left'
        }}>

          Tilbehør

        </div>
        <div style={{ marginTop: '20px', textAlign: 'left', backgroundColor: 'beige' }}>
          {toppings.map((curTopping, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',    // Border around each row
                padding: '10px',             // Optional: Adds spacing inside each row
                marginBottom: '5px',         // Optional: Adds spacing between rows
                display: 'grid',
                gridTemplateColumns: '3fr 4fr 3fr 3fr 3fr 3fr 3fr', // Adjust column sizes as needed
                alignItems: 'center'
              }}
            >
              <div>{curTopping.name}</div>
              <div>{curTopping.description}</div>
              <div>{curTopping.price}</div>
              <div>
                <button
                  onClick={() => handleEditTopping(curTopping)}  // You'll define handleEdit below
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Rediger
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleDeleteTopping(curTopping)}  // You'll define handleEdit below
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={handleNewTopping}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8d4a5b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ny
          </button>
        </div>

        <div style={{
          textAlign: 'left'
        }}>

          Salat

        </div>
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          {pizzas.map((curPizza, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',    // Border around each row
                padding: '10px',             // Optional: Adds spacing inside each row
                marginBottom: '5px',         // Optional: Adds spacing between rows
                display: 'grid',
                gridTemplateColumns: '3fr 4fr 3fr 3fr 3fr 3fr 3fr', // Adjust column sizes as needed
                alignItems: 'center'
              }}
            >
              <div>{curPizza.name}</div>
              <div>{curPizza.description}</div>
              <div>{curPizza.discountprice}</div>
              <div>{curPizza.discountpercentage}</div>
              <div>{curPizza.discountprice}</div>
              <div>
                <button
                  onClick={() => handleEditPizza(curPizza)}  // You'll define handleEdit below
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Rediger
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleDeletePizza(curPizza)}  // You'll define handleEdit below
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={handleNewPizza}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8d4a5b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ny
          </button>
        </div>
      </div>




    </div>
  )
}

export default AdminMenues;