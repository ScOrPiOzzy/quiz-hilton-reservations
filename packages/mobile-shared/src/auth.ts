import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($phone: String!, $code: String!) {
    login(phone: $phone, code: $code) {
      token
      user {
        id
        firstName
        lastName
        email
        phone
      }
    }
  }
`

export const LOGIN_PASSWORD = gql`
  mutation LoginPassword($phone: String!, $password: String!) {
    loginPassword(phone: $phone, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        phone
      }
    }
  }
`

export const SEND_CODE = gql`
  mutation SendCode($phone: String!) {
    sendCode(phone: $phone) {
      success
      message
    }
  }
`

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        phone
      }
    }
  }
`

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`
