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
      images {
        id
        url
        alt
        order
      }
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
      images {
        id
        url
        alt
        order
      }
    }
  }
`;

const DELETE_RESTAURANT = `
  mutation DeleteRestaurant($id: String!) {
    deleteRestaurant(id: $id)
  }
`;

const SOFT_DELETE_RESTAURANT = `
  mutation SoftDeleteRestaurant($id: String!) {
    updateRestaurant(input: { id: $id, status: "DELETED" }) {
      id
      status
    }
  }
`;

const UPDATE_RESTAURANT_STATUS = `
  mutation UpdateRestaurantStatus($id: String!, $status: String!) {
    updateRestaurant(input: { id: $id, status: $status }) {
      id
      name
      status
      updatedAt
    }
  }
`;

const GET_AREAS_BY_RESTAURANT = `
  query GetAreasByRestaurant($restaurantId: String!) {
    areasByRestaurant(restaurantId: $restaurantId) {
      id
      name
      type
      capacity
      minimumCapacity
      restaurantId
    }
  }
`;

const CREATE_AREA = `
  mutation CreateArea($restaurantId: String!, $name: String!, $type: String, $capacity: Int, $minimumCapacity: Int) {
    createArea(restaurantId: $restaurantId, name: $name, type: $type, capacity: $capacity, minimumCapacity: $minimumCapacity) {
      id
      name
      type
      capacity
      minimumCapacity
      restaurantId
    }
  }
`;

const UPDATE_AREA = `
  mutation UpdateArea($id: String!, $name: String, $type: String, $capacity: Int, $minimumCapacity: Int) {
    updateArea(id: $id, name: $name, type: $type, capacity: $capacity, minimumCapacity: $minimumCapacity) {
      id
      name
      type
      capacity
      minimumCapacity
      restaurantId
    }
  }
`;

const DELETE_AREA = `
  mutation DeleteArea($id: String!) {
    deleteArea(id: $id)
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

export function useSoftDeleteRestaurant() {
  return useMutation(SOFT_DELETE_RESTAURANT);
}

export function useUpdateRestaurantStatus() {
  return useMutation(UPDATE_RESTAURANT_STATUS);
}

export function useGetAreasByRestaurant() {
  return useMutation(GET_AREAS_BY_RESTAURANT);
}

export function useCreateArea() {
  return useMutation(CREATE_AREA);
}

export function useUpdateArea() {
  return useMutation(UPDATE_AREA);
}

export function useDeleteArea() {
  return useMutation(DELETE_AREA);
}
