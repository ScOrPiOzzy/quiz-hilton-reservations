import { useMutation } from "./graphql-hooks";

const CREATE_RESTAURANT = `
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      id
      name
      type
      hotelId
      description
      capacity
      images
    }
  }
`;

const UPDATE_RESTAURANT = `
  mutation UpdateRestaurant($input: UpdateRestaurantInput!) {
    updateRestaurant(input: $input) {
      id
      name
      type
      hotelId
      description
      capacity
      images
    }
  }
`;

const DELETE_RESTAURANT = `
  mutation DeleteRestaurant($id: String!) {
    deleteRestaurant(id: $id)
  }
`;

export function useCreateRestaurant() {
  return useMutation(CREATE_RESTAURANT);
}

export function useUpdateRestaurant() {
  return useMutation(UPDATE_RESTAURANT);
}

export function useDeleteRestaurant() {
  return useMutation(DELETE_RESTAURANT);
}
