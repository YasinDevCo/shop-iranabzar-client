import { Component } from '@angular/core';
import {Banner} from '../../components/home/banner/banner';
import {Category} from '../../components/home/category/category';
import {CardsContainer} from '../../components/cards/cards-container/cards-container';
import {NewestProducts} from '../../components/home/newest-products/newest-products';
import {DiscountProducts} from '../../components/home/discount-products/discount-products';
import {BestsellingProducts} from '../../components/home/bestselling-products/bestselling-products';

@Component({
  selector: 'app-home',
  imports: [
    Banner,
    Category,
    CardsContainer,
    NewestProducts,
    DiscountProducts,
    BestsellingProducts
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
