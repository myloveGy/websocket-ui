import {createToastInterface} from 'vue-toastification'

export const sync = (fn: any, loading: boolean = false) => {
  return fn().catch((error: any) => {
    createToastInterface({timeout: 1000}).error(error.message)
  })
}
