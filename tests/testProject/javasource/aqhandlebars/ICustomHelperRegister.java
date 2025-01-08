package aqhandlebars;

import com.github.jknack.handlebars.Handlebars;

public interface ICustomHelperRegister {
	public void registerCustomHelpers(Handlebars handlebars) throws Exception;
}