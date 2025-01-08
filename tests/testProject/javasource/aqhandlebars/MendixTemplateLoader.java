package aqhandlebars;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import com.github.jknack.handlebars.io.StringTemplateSource;
import com.github.jknack.handlebars.io.TemplateLoader;
import com.github.jknack.handlebars.io.TemplateSource;

public class MendixTemplateLoader implements TemplateLoader {

	private Map<String, String> map;
	private Charset charset;
	
	public MendixTemplateLoader(final Map<String, String> map) {
	    this.map = map;
	  }
	
	public MendixTemplateLoader() {
	    this(new HashMap<String, String>());
	  }
	
	public MendixTemplateLoader define(final String name, final String content) {
	    map.put(getPrefix() + name + getSuffix(), content);
	    return this;
	  }
	
	@Override
	public Charset getCharset() {
		return charset == null ? StandardCharsets.UTF_8 : charset;
	}

	@Override
	public String getPrefix() {
		return "";
	}

	@Override
	public String getSuffix() {
		return "";
	}

	@Override
	public String resolve(String name) {
		return getPrefix() + name + getSuffix();
	}

	@Override
	public void setCharset(Charset arg0) {
		this.charset = org.apache.commons.lang3.Validate.notNull(charset, "Charset required.");
	}

	@Override
	public void setPrefix(String arg0) {
	}

	@Override
	public void setSuffix(String arg0) {
	}

	@Override
	public TemplateSource sourceAt(String name) throws IOException {
		String location = resolve(name);
	    String text = map.get(location);
	    if (text == null) {
	      throw new FileNotFoundException(location);
	    }
	    return new StringTemplateSource(location, text);
	}
	
}
