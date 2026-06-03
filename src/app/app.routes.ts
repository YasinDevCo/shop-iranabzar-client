import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {Register} from './pages/register/register';
import {Login} from './pages/login/login';
import {ContactUs} from './pages/contact-us/contact-us';
import {Blogs} from './pages/blogs/blogs';
import {authGuard} from './guards/auth-guard';
import {adminGuard} from './guards/admin-guard';
import {UserPanelProfile} from './pages/dashboard/user-panel-profile/user-panel-profile';
import {UserPanelHome} from './pages/dashboard/user-panel-home/user-panel-home';
import {UserPanelProducts} from './pages/dashboard/user-panel-products/user-panel-products';
import {UserPanelUsers} from './pages/dashboard/user-panel-users/user-panel-users';
import {UserPanelBlogs} from './pages/dashboard/user-panel-blogs/user-panel-blogs';
import {UserPanelMessages} from './pages/dashboard/user-panel-messages/user-panel-messages';
import {UserPanelPayments} from './pages/dashboard/user-panel-payments/user-panel-payments';
import {UserPanelCategories} from './pages/dashboard/user-panel-categories/user-panel-categories';
import {DashboardLayout} from './layouts/dashboard-layout/dashboard-layout';
import {MainLayout} from './layouts/main-layout/main-layout';
import {MyOrders} from './pages/dashboard/my-orders/my-orders';
import {OrderDetails} from './pages/dashboard/order-details/order-details';
import {MyPayments} from './pages/dashboard/my-payments/my-payments';
import {Wishlist} from './pages/dashboard/wishlist/wishlist';
import {MyAddresses} from './pages/dashboard/my-addresses/my-addresses';
import {MyReviews} from './pages/dashboard/my-reviews/my-reviews';
import {BlogDetails} from './pages/blog-details/blog-details';
import {ProductsListComponent} from './pages/products-list/products-list';
import {ProductDetailsComponent} from './pages/product-details/product-details';
import {CartComponent} from './pages/cart/cart';
import {Faq} from './pages/faq/faq';
import {Checkout} from './components/checkout/checkout';
import {PaymentVerify} from './pages/payment-verify/payment-verify';


export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {path: '', component: Home},
      {path: 'register', component: Register},
      {path: 'login', component: Login},
      {path: 'blogs', component: Blogs},
      {path: 'blog/:slug', component: BlogDetails},
      {path: 'contact', component: ContactUs},
      {path: 'faq', component: Faq},
      {path: 'products', component: ProductsListComponent},
      {path: 'product/:id', component: ProductDetailsComponent},
      {path: 'cart', component: CartComponent},
      {path: 'checkout', component: Checkout},
      {path: 'payment/verify/:id', component: PaymentVerify},

    ]
  },

  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        children: [
          {path: 'home', component: UserPanelHome},
          {path: 'profile', component: UserPanelProfile},
          {path: 'users', component: UserPanelUsers, canActivate: [adminGuard]},
          {path: 'products', component: UserPanelProducts, canActivate: [adminGuard]},
          {path: 'blogs', component: UserPanelBlogs, canActivate: [adminGuard]},
          {path: 'categories', component: UserPanelCategories, canActivate: [adminGuard]},
          {path: 'messages', component: UserPanelMessages, canActivate: [adminGuard]},
          {path: 'payments', component: UserPanelPayments, canActivate: [adminGuard]},
          {path: 'my-orders', component: MyOrders},
          {path: 'order-details/:id', component: OrderDetails},
          {path: 'my-payments', component: MyPayments},
          {path: 'wishlist', component: Wishlist},
          {path: 'my-addresses', component: MyAddresses},
          {path: 'my-reviews', component: MyReviews},

          {path: '', redirectTo: 'home', pathMatch: 'full'}
        ]
      }
    ]
  }
];
