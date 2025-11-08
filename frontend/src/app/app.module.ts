import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import standalone components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderTrackingComponent } from './components/order-tracking/ordertracking.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AdminComponent } from './components/admin/admin.component';
 
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AppComponent,
    HomeComponent, 
    LoginComponent, 
    MenuComponent, 
    CartComponent, 
    CheckoutComponent, 
    RegisterComponent, 
    OrderTrackingComponent,
    PaymentComponent, 
    AdminComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }