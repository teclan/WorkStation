package com.znyw.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.ContextLoader;

import com.znyw.auth.AuthenticateFilter;
import com.znyw.auth.AuthenticateService;

public class InitServlet extends HttpServlet {
	private static final Logger LOGGER = LoggerFactory.getLogger(InitServlet.class);

	private static final long serialVersionUID = 7028862897168431723L;

	AuthenticateService authenticateService = (AuthenticateService) ContextLoader.getCurrentWebApplicationContext()
			.getBean("authenticateService");

	@Override
	public void init() throws ServletException {
		super.init();
		
		AuthenticateFilter.setAuthenticateService(authenticateService);

	}

}
