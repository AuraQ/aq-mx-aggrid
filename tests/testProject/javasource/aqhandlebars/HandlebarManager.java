package aqhandlebars;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Scanner;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jknack.handlebars.Context;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.JsonNodeValueResolver;
import com.github.jknack.handlebars.Template;
import com.mendix.core.Core;
import com.mendix.datastorage.XPathQuery;
import com.mendix.logging.ILogNode;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObject;

import aqhandlebars.proxies.CustomHelperRegister;
import aqhandlebars.proxies.PartialTemplate;

public class HandlebarManager {
	private IContext _context;
	private JsonNode _jsonNode;
	private ILogNode _log = Core.getLogger(HandlebarManager.class.toString());
	private List<PartialTemplate> _partials;
	
	public HandlebarManager(IContext context, String exportMappingName, IMendixObject objectToExport, List<PartialTemplate> partials) throws JsonMappingException, JsonProcessingException, IOException {
		_context = context;
		
		_jsonNode = exportMappingToJsonNodeForObject(exportMappingName, objectToExport);
		_partials = partials;
	}
	
	public HandlebarManager(IContext context, String exportMappingName, List<IMendixObject> objectsToExport, List<PartialTemplate> partials) throws JsonMappingException, JsonProcessingException, IOException {
		_context = context;
		
		_jsonNode = exportMappingToJsonNodeForObjectList(exportMappingName, objectsToExport);
		_partials = partials;
	}
	
	public HandlebarManager(IContext context, String jsonString, List<PartialTemplate> partials) throws JsonMappingException, JsonProcessingException, IOException {
		_context = context;
		
		ObjectMapper mapper = new ObjectMapper();
		_jsonNode = mapper.readTree(jsonString);
		_partials = partials;
	}
	
	public String generateFromTemplate(String templateContents) throws InstantiationException, IllegalAccessException, ClassNotFoundException, Exception {
		Context context = Context
	            .newBuilder(_jsonNode)
	            .resolver(JsonNodeValueResolver.INSTANCE)
	            .build();
		
		_log.debug("Template Contents:");
		_log.debug(templateContents);
					
		Template template = getHandlebars().compileInline(templateContents);
			
		String output = template.apply(context);
		
		return output;
	}
	
	private Handlebars getHandlebars() throws InstantiationException, IllegalAccessException, ClassNotFoundException, Exception {
		MendixTemplateLoader loader = new MendixTemplateLoader();		

		// load partials templates
		if(_partials != null && _partials.size() > 0) {
			for(PartialTemplate partial : _partials) {
				loader.define(partial.getName(), partial.getContent());				
			}
		}
		
		Handlebars handlebars = new Handlebars().with(loader);
	    		
		// register custom helpers
		for(IMendixObject mxCustomHelperRegister : loadCustomHelperRegisters()) {
			CustomHelperRegister customHelperRegister = CustomHelperRegister.initialize(_context, mxCustomHelperRegister);
			String className = customHelperRegister.getClassName();
			((ICustomHelperRegister)Class.forName(className).newInstance()).registerCustomHelpers(handlebars);
			
		}
		
		return handlebars;
	}
	
	private JsonNode exportMappingToJsonNodeForObject(String exportMappingName, IMendixObject objectToExport)
			throws IOException, JsonProcessingException, JsonMappingException {
		String jsonString = "";
		try(InputStream inputStream = Core.integration().exportToStream(_context, exportMappingName, objectToExport, false)){
			try (Scanner scanner = new Scanner(inputStream)) {
				jsonString = scanner.useDelimiter("\\A").next();
			}
		}
		
		_log.debug("JSON from Export Mapping:");
		_log.debug(jsonString);
		
		ObjectMapper mapper = new ObjectMapper();
	    JsonNode jsonNode = mapper.readTree(jsonString);

		return jsonNode;
	}
	
	private JsonNode exportMappingToJsonNodeForObjectList(String exportMappingName, List<IMendixObject> objectsToExport)
			throws IOException, JsonProcessingException, JsonMappingException {
		String jsonString = "";
		try(InputStream inputStream = Core.integration().exportToStream(_context, exportMappingName, objectsToExport, false)){
			try (Scanner scanner = new Scanner(inputStream)) {
				jsonString = scanner.useDelimiter("\\A").next();
			}
		}
		
		_log.debug("JSON from Export Mapping:");
		_log.debug(jsonString);
		
		ObjectMapper mapper = new ObjectMapper();
	    JsonNode jsonNode = mapper.readTree(jsonString);

		return jsonNode;
	}
	
	private List<IMendixObject> loadCustomHelperRegisters(){
		
		XPathQuery xpathQuery = Core.createXPathQuery(String.format("//%s", CustomHelperRegister.entityName));
		
		List<IMendixObject> customHelperRegisters = xpathQuery.execute(_context);
		
		return customHelperRegisters;
	}
}
