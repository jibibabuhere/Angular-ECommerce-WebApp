import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddressComponent } from './Pages/address/address.component';
import { CartComponent } from './Pages/cart/cart.component';
import { ReviewComponent } from './Pages/review/review.component';
import { ThankYouComponent } from './Pages/thank-you/thank-you.component';
import { ErrorComponent } from './Pages/error/error.component';
import { LoginComponent } from './Pages/login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'address', component: AddressComponent, canActivate: [AuthGuard] },
    { path: 'review', component: ReviewComponent, canActivate: [AuthGuard] },
    { path: 'thankyou', component: ThankYouComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'error', component: ErrorComponent },
    { path: '', redirectTo: '/cart', pathMatch: 'full' },
    { path: '**', redirectTo: '/error' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false
        })
    ],
    exports: [RouterModule]
})

export class AppRoutingModule { }
