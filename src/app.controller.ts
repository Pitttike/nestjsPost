import { Controller, Get, Post, Render, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NewAccountDto } from './newAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #accounts = [
    {
      id: '1234-5678',
      owner: 'Admin',
      balance: 15000,
    },
    {
      id: '1234-5679',
      owner: 'Jozsef',
      balance: -1211,
    },
    {
      id: '1234-5610',
      owner: 'KokakÓla',
      balance: 10010100,
    },
  ]

  @Get('newAccount')
  @Render('newAccountForm')
  newAccountForm() {
    return {
      errors: [],
      data: {}
    }
  }

  @Post('newAccount')
  newAccount(@Body() accountData : NewAccountDto, @Res() response : Response) {
    const errors: string[] = [];

    if (!accountData.balance || !accountData.owner || !accountData.id) {
        errors.push('Minden mezőt kötelező megadni!');
    }

    if (!/^\d{4}-\d{4}$/.test(accountData.id)) {
      errors.push('A számlaszám nem megfelelő formátumú')
    }

    if (accountData.balance < 0) {
      errors.push('A kezdő egyenleg szám kell, hogy legyen')
    }
    if (isNaN(accountData.balance)) {
      errors.push('A kezdő egyenleg szám kell, hogy legyen')
    }

    if (this.#accounts.find(e => e.id == accountData.id) != undefined) {
      errors.push('Ilyen azonosítójú számla már létezik')
    }
    let newAccount = {
      id : accountData.id,
      owner : accountData.owner,
      balance : accountData.balance,
    }

    if (errors.length > 0) {
      response.render('NewAccountForm', {
        errors,
        data: accountData
      })
      return;
    }

    this.#accounts.push(newAccount);
    // 303 -> /newAccountSuccess
    response.redirect(303, '/newAccountSuccess')
  }

  @Get('newAccountSuccess')
  @Render('success')
  newAccountSuccess() {
    return {
      accounts : this.#accounts.length
    }
  }

}
