package com.web.n7.repository;

import com.web.n7.model.PlayerPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerPerformanceRepository extends JpaRepository<PlayerPerformance, Long> {
    

}