package com.ts.app.web.rest.dto;

public class TokenTransfer
{

	private final String token;


	public TokenTransfer(String token)
	{
		this.token = token;
	}


	public String getToken()
	{
		return this.token;
	}

}