import { useMutation } from "./graphql-hooks";

const CREATE_HOTEL = `
  mutation CreateHotel($input: CreateHotelInput!) {
    createHotel(input: $input) {
      id
      name
      city
      address
      description
      phone
      email
      status
      createdAt
    }
  }
`;

const UPDATE_HOTEL = `
  mutation UpdateHotel($input: UpdateHotelInput!) {
    updateHotel(input: $input) {
      id
      name
      city
      address
      description
      phone
      email
      status
      updatedAt
    }
  }
`;

const DELETE_HOTEL = `
  mutation DeleteHotel($id: String!) {
    deleteHotel(id: $id)
  }
`;

const UPDATE_HOTEL_STATUS = `
  mutation UpdateHotelStatus($input: UpdateHotelInput!) {
    updateHotel(input: $input) {
      id
      name
      status
      updatedAt
    }
  }
`;

export function useCreateHotel() {
  return useMutation(CREATE_HOTEL);
}

export function useUpdateHotel() {
  return useMutation(UPDATE_HOTEL);
}

export function useDeleteHotel() {
  return useMutation(DELETE_HOTEL);
}

export function useUpdateHotelStatus() {
  return useMutation(UPDATE_HOTEL_STATUS);
}
