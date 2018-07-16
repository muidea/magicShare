package core

import (
	"encoding/json"
	"log"
	"net/http"

	"muidea.com/magicCommon/agent"
	common_const "muidea.com/magicCommon/common"
	common_def "muidea.com/magicCommon/def"
	"muidea.com/magicCommon/model"
	engine "muidea.com/magicEngine"
)

type route struct {
	pattern string
	method  string
	handler interface{}
}

func (s *route) Pattern() string {
	return s.pattern
}

func (s *route) Method() string {
	return s.method
}

func (s *route) Handler() interface{} {
	return s.handler
}

func newRoute(pattern, method string, handler interface{}) engine.Route {
	return &route{pattern: pattern, method: method, handler: handler}
}

// New 新建Share
func New(centerServer, name, endpointID, authToken string) (Share, bool) {
	share := Share{}

	agent := agent.New()
	sessionID, ok := agent.Start(centerServer, endpointID, authToken)
	if !ok {
		return share, false
	}
	shareCatalog, ok := agent.FetchSummary(name, model.CATALOG, authToken, sessionID)
	if !ok {
		catalog := model.Catalog{ID: common_const.BuildinContentCatalog.ID, Name: common_const.BuildinContentCatalog.Name}
		_, ok = agent.CreateCatalog(name, "MagicShare auto create catalog.", []model.Catalog{catalog}, authToken, sessionID)
		if !ok {
			log.Print("create share root catalog failed.")
			return share, false
		}
	}
	shareCatalog, ok = agent.FetchSummary(name, model.CATALOG, authToken, sessionID)
	if !ok {
		log.Print("fetch share root ctalog failed.")
		return share, false
	}

	shareContent := agent.QuerySummaryContent(shareCatalog.ID, model.CATALOG, authToken, sessionID)

	share.centerAgent = agent
	share.shareInfo = shareCatalog
	share.shareContent = shareContent
	share.endpointID = endpointID
	share.authToken = authToken
	share.sessionID = sessionID

	return share, true
}

// Share Share对象
type Share struct {
	centerAgent  agent.Agent
	shareInfo    model.SummaryView
	shareContent []model.SummaryView
	endpointID   string
	authToken    string
	sessionID    string
}

// Startup 启动
func (s *Share) Startup(router engine.Router) {
	mainRoute := newRoute("/", "GET", s.mainPage)
	router.AddRoute(mainRoute)

	statusRoute := newRoute("/user/status", "GET", s.statusAction)
	router.AddRoute(statusRoute)

	loginRoute := newRoute("/user/login", "POST", s.loginAction)
	router.AddRoute(loginRoute)

	logoutRoute := newRoute("/user/logout", "DELETE", s.logoutAction)
	router.AddRoute(logoutRoute)

	catalogCreateRoute := newRoute("/file/", "POST", s.uploadAction)
	router.AddRoute(catalogCreateRoute)

	catalogQueryRoute := newRoute("/file/:id", "GET", s.viewAction)
	router.AddRoute(catalogQueryRoute)

	catalogDeleteRoute := newRoute("/file/:id", "DELETE", s.deleteAction)
	router.AddRoute(catalogDeleteRoute)
}

// Teardown 销毁
func (s *Share) Teardown() {
	if s.centerAgent != nil {
		s.centerAgent.Stop()
	}
}

func (s *Share) getShareView() (model.SummaryView, bool) {
	for _, v := range s.shareContent {
		if v.Name == "shareCatalog" && v.Type == model.CATALOG {
			return v, true
		}
	}

	return model.SummaryView{}, false
}

func (s *Share) mainPage(res http.ResponseWriter, req *http.Request) {
	log.Print("mainPage")

	result := common_def.QuerySummaryListResult{}
	shareView, ok := s.getShareView()
	if ok {
		result.Summary = s.centerAgent.QuerySummaryContent(shareView.ID, model.CATALOG, s.authToken, s.sessionID)
		result.ErrorCode = common_def.Success
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	log.Print("mainPage, json.Marshal, failed, err:" + err.Error())
}
