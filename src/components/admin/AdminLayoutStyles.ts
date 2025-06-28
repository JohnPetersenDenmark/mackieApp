import styled from 'styled-components';

// Main wrapper for the page content
export const AdminContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
`;

// Section container with customizable background
export const SectionWrapper = styled.div<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
`;

// Section headline
export const SectionTitle = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #22191b;
`;

// Grid header pizza row
export const GridHeaderPizza = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  font-weight: 700;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: 600px) {
  display: none;

 
`;

// Grid header pizza row
export const GridHeaderTopping = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  font-weight: 700;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: 600px) {
  display: none;

 
`;

// Grid data row
export const GridRowPizza = styled.div`
  display: grid;
  grid-template-columns:  1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    & > div {
      margin-bottom: 8px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
  }
`;

export const GridRowTopping = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    & > div {
      margin-bottom: 8px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
  }
`;

// Image wrapper
export const ImageWrapper = styled.div`

  & > img {
    max-width: 100px;
    height: auto;
    margin-top: 5px;
  }

  @media (max-width: 600px) {
    background: #8d4a5b;
  }
`;

// Icon for edit/delete actions
export const ActionIcon = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

// Wrapper to center the "new" icon
export const NewIconWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
