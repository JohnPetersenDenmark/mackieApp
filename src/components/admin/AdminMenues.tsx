import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Pizza } from '../../types/Pizza';
import { Topping } from '../../types/Topping';
import AdminPizzaCreateEdit from './AdminPizzaCreateEdit';
import AdminToppingCreateEdit from './AdminToppingCreateEdit';
import config from '../../config';
import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

import {
  AdminContainer,
  SectionWrapper,
  SectionTitle,
  GridHeaderPizza,
  GridHeaderTopping,
  GridRowPizza,
  GridRowTopping,
  ImageWrapper,
  ActionIcon,
  NewIconWrapper
} from './AdminLayoutStyles';

// ✅ Full-width responsive container
const Container = styled.div`
  width: 100%;
 
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  font-size: 20px;
  color: #22191b;
  font-weight: 200;
`;

const AdminMenues: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [pizzaToEdit, setPizzaToEdit] = useState<Pizza | null>(null);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [toppingToEdit, setToppingToEdit] = useState<Topping | null>(null);
  const [isCreateEditPizzaModalOpen, setIsCreateEditPizzaModalOpen] = useState(false);
  const [isCreateEditToppingModalOpen, setIsCreateEditToppingModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
   const [reload, setReload] = useState(0); 

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await AxiosClientGet('/Home/pizzalist', false);
        setPizzas(response);
      } catch {
        setError('Failed to load pizzas');
      }
    };

    const fetchToppings = async () => {
      try {
        const response = await AxiosClientGet('/Home/toppinglist', false);
        setToppings(response);
      } catch {
        setError('Failed to load toppings');
      }
    };

    fetchPizzas();
    fetchToppings();
  }, [isCreateEditPizzaModalOpen, isCreateEditToppingModalOpen, submitting, reload]);

  const handleDeletePizza = async (pizza: Pizza) => {
    try {
      setSubmitting(true);
      await AxiosClientDelete('/Admin/removepizza/' + pizza.id, true);
      setReload(prev => prev + 1);
    } catch {
      setError('Failed to delete pizza');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTopping = async (topping: Topping) => {
    try {
      setSubmitting(true);
      await AxiosClientDelete('/Admin/removetopping/' + topping.id, true);
    } catch {
      setError('Failed to delete topping');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseCreateEditPizzaModal = () => { 
    setIsCreateEditPizzaModalOpen(false);
      setReload(prev => prev + 1);
  };

   const handleCloseCreateEditToppingModal = () => { 
    setIsCreateEditToppingModalOpen(false);
      setReload(prev => prev + 1);
  };


  return (
    <Container>
      <AdminPizzaCreateEdit
        isOpen={isCreateEditPizzaModalOpen}
        onClose={() => handleCloseCreateEditPizzaModal()}
        pizzaToEdit={pizzaToEdit}
      />

      <AdminToppingCreateEdit
        isOpen={isCreateEditToppingModalOpen}
        onClose={() => handleCloseCreateEditToppingModal()}
        toppingToEdit={toppingToEdit}
      />

      <div style={{ fontSize: '2rem',
      fontWeight: 600,
      color: '#22191b',
      margin: '20px',
      textAlign: 'center' as const,}}>Menuer</div>

      {/* Pizzas Section */}
      <SectionWrapper bgColor='#ffffff' >
        <GridHeaderPizza>
          <div></div>
          <div>Nr.</div>
          <div>Navn</div>
          <div>Beskrivelse</div>
          {/*  <div>Pris før rabat</div>
          <div>Rabat %</div> */}
          <div>Pris efter rabat</div>
          <div></div>
          <div></div>
        </GridHeaderPizza>

        {pizzas.map((pizza, index) => (
          <GridRowPizza key={index}>
            <ImageWrapper>
              <img src={`${config.API_BASE_URL}${pizza.imageurl}`} alt={pizza.name} />
            </ImageWrapper>
            <div>{pizza.pizzanumber}</div>
            <div>{pizza.name}</div>
            <div>{pizza.description}</div>
            {/*   <div>{pizza.discountprice.toFixed(2).replace('.', ',')}</div>
            <div>{pizza.discountpercentage}</div> */}
            <div>{pizza.price.toFixed(2).replace('.', ',')}</div>
            <div>
              <ActionIcon
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => {
                  setPizzaToEdit(pizza);
                  setIsCreateEditPizzaModalOpen(true);
                }}
              />
            </div>
            <div>
              <ActionIcon
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDeletePizza(pizza)}
              />
            </div>
          </GridRowPizza>
        ))}


        <NewIconWrapper>
          <ActionIcon src="/images/new-icon.png" alt="Ny" onClick={() => {
            setPizzaToEdit(null);
            setIsCreateEditPizzaModalOpen(true);
          }} />
        </NewIconWrapper>



      </SectionWrapper>

      {/* Toppings Section */}
      <SectionWrapper bgColor="white">
        <GridHeaderTopping>
          <div></div>
          <div>Tilbehør</div>
          <div>Beskrivelse</div>
          <div>Pris</div>

          <div></div>
          <div></div>

        </GridHeaderTopping>

        {toppings.map((topping, index) => (
          <GridRowTopping key={index}>
            <ImageWrapper>
              <img src={`${config.API_BASE_URL}${topping.imageurl}`} />
            </ImageWrapper>

            <div>{topping.name}</div>
            <div>{topping.description}</div>
            <div>{topping.price.toFixed(2).replace('.', ',')}</div>

            <div>
              <ActionIcon
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => {
                  setToppingToEdit(topping);
                  setIsCreateEditToppingModalOpen(true);
                }}
              />
            </div>
            <div>
              <ActionIcon
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDeleteTopping(topping)}
              />
            </div>
          </GridRowTopping>
        ))}


        <NewIconWrapper>
          <ActionIcon src="/images/new-icon.png" alt="Ny" onClick={() => {
            setToppingToEdit(null);
            setIsCreateEditToppingModalOpen(true);
          }} />
        </NewIconWrapper>


      </SectionWrapper>
    </Container>
  );
};

export default AdminMenues;
