import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const token = ref('')
  const username = ref('')
  function updateToken(payload) {
    token.value = payload
  }
  function clearToken() {
    token.value = ''
  }
  function updateUsername(payload) {
    username.value = payload
  }
  return { 
    token,
    username,
    updateToken,
    clearToken,
    updateUsername
  }
}
// , {
//   persist: {
//     paths: ['token']
//   }
// }
)
