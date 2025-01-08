package system;

import com.mendix.core.actionmanagement.IActionRegistrator;

public class UserActionsRegistrar
{
  public void registerActions(IActionRegistrator registrator)
  {
    registrator.registerUserAction(aqhandlebars.actions.CustomHelperRegisterClassIsValid.class);
    registrator.registerUserAction(aqhandlebars.actions.GenerateForExportDocumentAndObject.class);
    registrator.registerUserAction(aqhandlebars.actions.GenerateForExportDocumentAndObjectList.class);
    registrator.registerUserAction(aqhandlebars.actions.GenerateForExportNameAndObject.class);
    registrator.registerUserAction(aqhandlebars.actions.GenerateForExportNameAndObjectList.class);
    registrator.registerUserAction(aqhandlebars.actions.GenerateForJSONString.class);
    registrator.registerUserAction(system.actions.VerifyPassword.class);
  }
}
