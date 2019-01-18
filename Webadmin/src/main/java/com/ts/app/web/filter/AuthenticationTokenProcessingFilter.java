package com.ts.app.web.filter;

import com.ts.app.web.rest.dto.TokenTransfer;
import com.ts.app.web.rest.util.TokenUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthenticationTokenProcessingFilter extends OncePerRequestFilter
{
	
	private static final Logger log = LoggerFactory.getLogger(AuthenticationTokenProcessingFilter.class);

	private UserDetailsService userDetailsService;

	public AuthenticationTokenProcessingFilter(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}
	
	public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException,
			ServletException
	{
		//HttpServletRequest httpRequest = this.getAsHttpRequest(request);
		log.debug("AuthenticationTokenProcessingFilter - request uri -"+request.getRequestURL().toString());	
		if(!request.getRequestURL().toString().contains("/auth")) {  //no token validation for auth calls. 
			String authToken = this.extractAuthTokenFromRequest(request);
			String userName = TokenUtils.getUserNameFromToken(authToken);
	
			if (userName != null) {
	
				UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
	
				if (TokenUtils.validateToken(authToken, userDetails)) {
	
					UsernamePasswordAuthenticationToken authentication =
							new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}else {
					TokenTransfer token = new TokenTransfer(TokenUtils.createToken(userDetails));
					response.setStatus(HttpStatus.UNAUTHORIZED.value());
					response.getWriter().write("{ \"error\" : \"Unauthorized request : Token expired\" , \"newToken\" : \""+token.getToken()+"\" }");
					return;
					
				}
			}else {
				if(request.getHeader("User-Agent")!= null 
						&& request.getHeader("User-Agent").indexOf("Mobile") != -1) {
					log.debug("AuthenticationTokenProcessingFilter - request uri -"+request.getRequestURL().toString());	
					if(!request.getRequestURL().toString().contains("/auth")) {
						response.reset();
						response.setStatus(HttpStatus.UNAUTHORIZED.value());
						response.getWriter().write("{ \"error\" : \"Unauthorized request : Token not found \" }");
						return;
					}
				}	
			}
		}	

		chain.doFilter(request, response);
	}


	private HttpServletRequest getAsHttpRequest(ServletRequest request)
	{
		if (!(request instanceof HttpServletRequest)) {
			throw new RuntimeException("Expecting an HTTP request");
		}

		return (HttpServletRequest) request;
	}


	private String extractAuthTokenFromRequest(HttpServletRequest httpRequest)
	{
		/* Get token from header */
		String authToken = httpRequest.getHeader("X-Auth-Token");

		/* If token not found get it from request parameter */
		if (authToken == null) {
			authToken = httpRequest.getParameter("token");
		}

		return authToken;
	}


}
