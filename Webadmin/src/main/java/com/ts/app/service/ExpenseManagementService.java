package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Expense;
import com.ts.app.repository.ExpenseRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExpenseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.inject.Inject;
import java.util.List;

public class ExpenseManagementService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    @Inject
    private ExpenseRepository expenseRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;


    public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {

        return expenseDTO;
    }

    public List<ExpenseDTO> findAll(int currPage) {
        Pageable pageRequest = createPageRequest(currPage);
        Page<Expense> result = expenseRepository.findAll(pageRequest);
        return mapperUtil.toModelList(result.getContent(), ExpenseDTO.class);
    }
}
