import { useMutation } from "./graphql-hooks";

const UPDATE_RESERVATION_STATUS = `
  mutation UpdateReservationStatus($input: UpdateReservationStatusInput!) {
    updateStatus(input: $input) {
      id
      status
    }
  }
`;

const CANCEL_RESERVATION = `
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id) {
      id
    }
  }
`;

export function useUpdateReservationStatus() {
  return useMutation(UPDATE_RESERVATION_STATUS);
}

export function useCancelReservation() {
  return useMutation(CANCEL_RESERVATION);
}
