package com.znyw.auth;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;

public class AuthenticateFilter implements Filter {
	private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticateFilter.class);

	private static AuthenticateService authenticateService;

	public static AuthenticateService getAuthenticateService() {
		return authenticateService;
	}

	public static void setAuthenticateService(AuthenticateService authenticateService) {
		AuthenticateFilter.authenticateService = authenticateService;
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		HttpServletRequest hreq = (HttpServletRequest) request;
		String reqMethod = hreq.getMethod();
		  String uri = hreq.getRequestURI();  

		if (uri.contains("handleAlarmEvent")) {// 添加需要认证的接口
			if ("POST".equals(reqMethod)) {

				PrintWriter out = null;
				HttpServletResponse resp = (HttpServletResponse) response;
				response.setCharacterEncoding("UTF-8");
				response.setContentType("application/json; charset=UTF-8");

				BodyReaderHttpServletRequestWrapper requestWrapper = new BodyReaderHttpServletRequestWrapper(hreq);
				String body = HttpHelper.getBodyString(requestWrapper);
				// 如果是POST请求则需要获取 param 参数
				String param = URLDecoder.decode(body, "UTF-8");
				JSONObject paramJson = JSONObject.parseObject(param);

				boolean result = authenticateService.authenticate(paramJson.getString("userName"),
						paramJson.getString("token"));

				if (result) {
					LOGGER.info("\n认证通过:userName:{},token:{}", paramJson.getString("userName"),
							paramJson.getString("token"));
					chain.doFilter(requestWrapper, resp);
				} else {
					LOGGER.info("\n认证失败:userName:{},token:{}", paramJson.getString("userName"),
							paramJson.getString("token"));
					String json = getAuthenticationFailedMsg().toJSONString();
					response.getOutputStream().write(json.getBytes("UTF-8"), 0, json.length());
				}
			} else {
				chain.doFilter(request, response);
			}
		} else {
			chain.doFilter(request, response);
		}
		
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	private JSONObject getAuthenticationFailedMsg() {
		JSONObject authenticationFailed = new JSONObject();

		authenticationFailed.put("code", "401");
		authenticationFailed.put("message", "认证失败");

		return authenticationFailed;
	}

}
