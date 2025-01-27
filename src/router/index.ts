import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RecipeList from '../views/RecipeList.vue'
import PublicRecipeList from '../views/PublicRecipeList.vue'
import RecipeForm from '../views/RecipeForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipeList,
      meta: { requiresAuth: true },
    },
    {
      path: '/recipe-form',
      name: 'recipe-form',
      component: RecipeForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/public-recipes',
      name: 'public-recipes',
      component: PublicRecipeList,
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard for private routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/') // Redirect to login if not authenticated
  } else {
    next() // Allow navigation
  }
})

export default router
