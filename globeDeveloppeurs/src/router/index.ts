import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CityDetailsPage from '../views/CityDetailsPage.vue';
import RestaurantsPage from '../views/RestaurantsPage.vue'
import PlacesPage from '../views/PlacesPage.vue'
import LodgingPage from '../views/LodgingPage.vue'
import LoginPage from '../views/LoginPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import ReviewsPage from '../views/ReviewsPage.vue'
import WishListPage from '../views/WishListPage.vue';
import TravelerReviewsPage from '../views/TravelerReviewsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  } ,
  {
    path: '/details/:id/:name',
    name: 'Details',
    component: CityDetailsPage
  },
  {
    path: '/restaurants/:id/:name',
    name: 'Restaurants',
    component: RestaurantsPage
  },
  {
    path: '/places/:id/:name',
    name: 'Places',
    component: PlacesPage
  },
  {
    path: '/lodging/:id/:name',
    name: 'Lodging',
    component: LodgingPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage
  },
  {
    path: '/reviews/:name/:idDoc/:collectionName',
    name: 'Reviews',
    component: ReviewsPage
  },
  {
    path: '/wishlist',
    name: 'WishList',
    component: WishListPage
  },
  {
    path: '/traveler_reviews',
    name: 'TravelerReviews',
    component: TravelerReviewsPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
